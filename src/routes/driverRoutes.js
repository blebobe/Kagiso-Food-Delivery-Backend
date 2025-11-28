// src/routes/driverRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import { getAvailableDrivers, updateDriverLocation } from "../controllers/driverController.js";
const router = express.Router();
router.get("/available", auth, getAvailableDrivers);
router.patch("/:id/location", auth, updateDriverLocation);
export default router;
