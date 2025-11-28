// src/routes/driverAdminRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { adminCreateDriver, adminAssignDriver, adminToggleDriverAvailability, adminUpdateDriverLocation } from "../controllers/driverAdminController.js";
const router = express.Router();
router.post("/", auth, admin, adminCreateDriver);
router.post("/assign", auth, admin, adminAssignDriver);
router.patch("/:id/availability", auth, admin, adminToggleDriverAvailability);
router.patch("/:id/location", auth, admin, adminUpdateDriverLocation);
export default router;
