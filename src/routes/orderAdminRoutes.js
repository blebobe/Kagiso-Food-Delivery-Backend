// src/routes/orderAdminRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { adminGetAllOrders, adminUpdateOrderStatus } from "../controllers/orderAdminController.js";
const router = express.Router();
router.get("/", auth, admin, adminGetAllOrders);
router.patch("/:id", auth, admin, adminUpdateOrderStatus);
export default router;
