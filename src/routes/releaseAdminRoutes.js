import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  adminCreateRelease,
  adminUpdateRelease,
  adminDeleteRelease,
  adminListReleases,
  adminAddWhitelist,
  adminRemoveWhitelist,
  adminListWhitelist
} from "../controllers/releaseController.js";

const router = express.Router();

// Releases
router.post("/", auth, admin, adminCreateRelease);
router.put("/:id", auth, admin, adminUpdateRelease);
router.delete("/:id", auth, admin, adminDeleteRelease);
router.get("/", auth, admin, adminListReleases);

// Whitelist management for a release
router.post("/:releaseId/whitelist", auth, admin, adminAddWhitelist);
router.get("/:releaseId/whitelist", auth, admin, adminListWhitelist);
router.delete("/whitelist/:id", auth, admin, adminRemoveWhitelist);

export default router;
