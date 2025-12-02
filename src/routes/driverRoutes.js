// src/routes/driverRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import { getAvailableDrivers, updateDriverLocation, getDriverEarnings, updateOrderDelivered } from "../controllers/driverController.js";
const router = express.Router();
router.get("/available", auth, getAvailableDrivers);
router.get("/:id/earnings", auth, getDriverEarnings);
router.patch("/:id/location", auth, updateDriverLocation);
router.post("/order/:id/delivered", auth, updateOrderDelivered);
export default router;
