// src/routes/orderRoutes.js
import { allowOnlyKagiso } from "../middleware/locationRestriction.js";
import express from "express";
import auth from "../middleware/auth.js";
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
const router = express.Router();
router.post("/", auth, allowOnlyKagiso, createOrder);
router.get("/my", auth, getUserOrders);
router.get("/:id", auth, getOrderById);
router.patch("/:id/status", auth, updateOrderStatus);
export default router;
