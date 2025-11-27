import prisma from "../prisma.js";
import crypto from "crypto";

/**
 * Hash-based deterministic rollout:
 * hash(identifier) % 100 < rolloutPercent
 */
function isInRollout(identifier, rolloutPercent) {
  if (!identifier) return rolloutPercent >= 100;
  const h = crypto.createHash("sha256").update(String(identifier)).digest("hex").slice(0,8);
  const x = parseInt(h, 16) % 100;
  return x < rolloutPercent;
}

/**
 * PUBLIC: GET /version?platform=android&identifier=...&clientVersion=1.2.0
 */
export const getReleaseForIdentifier = async (req, res) => {
  try {
    const platform = String(req.query.platform || "android");
    const identifier = req.query.identifier ?? null;
    const clientVersion = req.query.clientVersion ?? null;

    const rel = await prisma.release.findFirst({
      where: { platform, active: true },
      orderBy: { createdAt: "desc" },
      include: { whitelists: true },
    });

    if (!rel) return res.json({ found: false });

    let inWhitelist = false;
    if (identifier) {
      for (const w of rel.whitelists || []) {
        if (w.identifier === identifier) { inWhitelist = true; break; }
      }
    }

    const inRollout = isInRollout(identifier, rel.rolloutPercent);

    const compare = (a,b) => {
      const pa = a.split('.').map(x => parseInt(x)||0);
      const pb = b.split('.').map(x => parseInt(x)||0);
      for (let i=0;i<Math.max(pa.length,pb.length);i++){
        const aa = pa[i]||0, bb = pb[i]||0;
        if (aa<bb) return -1;
        if (aa>bb) return 1;
      }
      return 0;
    };

    let mustUpdate = false;
    let optionalUpdate = false;
    if (clientVersion) {
      if (compare(clientVersion, rel.minimum) < 0) mustUpdate = true;
      else {
        if (inWhitelist && compare(clientVersion, rel.version) < 0) optionalUpdate = true;
        else if (inRollout && compare(clientVersion, rel.version) < 0) optionalUpdate = true;
      }
    } else {
      if (inWhitelist) optionalUpdate = true;
      else if (inRollout) optionalUpdate = true;
    }

    res.json({
      found: true,
      release: {
        id: rel.id,
        platform: rel.platform,
        version: rel.version,
        minimum: rel.minimum,
        rolloutPercent: rel.rolloutPercent,
        notes: rel.notes,
        active: rel.active,
        createdAt: rel.createdAt
      },
      rollout: {
        inWhitelist,
        inRollout,
        mustUpdate,
        optionalUpdate
      },
    });

  } catch (err) {
    console.error("getReleaseForIdentifier", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* Admin CRUD */
export const adminCreateRelease = async (req, res) => {
  try {
    const { platform, version, minimum, rolloutPercent = 100, notes = "", active = true } = req.body;
    const createdBy = req.user?.id;
    const rel = await prisma.release.create({
      data: { platform, version, minimum, rolloutPercent, notes, active, createdBy }
    });
    res.json(rel);
  } catch (err) {
    console.error("adminCreateRelease", err);
    res.status(500).json({ message: "Failed to create release" });
  }
};

export const adminUpdateRelease = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const rel = await prisma.release.update({ where: { id }, data });
    res.json(rel);
  } catch (err) {
    console.error("adminUpdateRelease", err);
    res.status(500).json({ message: "Failed to update release" });
  }
};

export const adminDeleteRelease = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.release.delete({ where: { id }});
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("adminDeleteRelease", err);
    res.status(500).json({ message: "Failed to delete release" });
  }
};

export const adminListReleases = async (req, res) => {
  try {
    const list = await prisma.release.findMany({ orderBy: { createdAt: "desc" }});
    res.json(list);
  } catch (err) {
    console.error("adminListReleases", err);
    res.status(500).json({ message: "Failed to list releases" });
  }
};

/* Whitelist CRUD */
export const adminAddWhitelist = async (req, res) => {
  try {
    const releaseId = Number(req.params.releaseId);
    const { type, identifier, note } = req.body;
    const entry = await prisma.releaseWhitelist.create({
      data: { releaseId, type, identifier, note }
    });
    res.json(entry);
  } catch (err) {
    console.error("adminAddWhitelist", err);
    if (err.code === 'P2002') return res.status(400).json({ message: "Whitelist entry exists" });
    res.status(500).json({ message: "Failed to add whitelist entry" });
  }
};

export const adminRemoveWhitelist = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.releaseWhitelist.delete({ where: { id }});
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("adminRemoveWhitelist", err);
    res.status(500).json({ message: "Failed to delete whitelist entry" });
  }
};

export const adminListWhitelist = async (req, res) => {
  try {
    const releaseId = Number(req.params.releaseId);
    const list = await prisma.releaseWhitelist.findMany({
      where: { releaseId },
      orderBy: { createdAt: "desc" }
    });
    res.json(list);
  } catch (err) {
    console.error("adminListWhitelist", err);
    res.status(500).json({ message: "Failed to list whitelist entries" });
  }
};
