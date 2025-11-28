// src/middleware/admin.js
export default function admin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
}
