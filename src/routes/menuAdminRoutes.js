// src/routes/menuAdminRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { adminCreateMenuItem, adminUpdateMenuItem, adminDeleteMenuItem } from "../controllers/menuAdminController.js";
const router = express.Router();
router.post("/", auth, admin, adminCreateMenuItem);
router.put("/:id", auth, admin, adminUpdateMenuItem);
router.delete("/:id", auth, admin, adminDeleteMenuItem);
export default router;
