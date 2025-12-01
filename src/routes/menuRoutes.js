// src/routes/menuRoutes.js
import express from "express";
import { getMenuByRestaurant } from "../controllers/menuController.js";
const router = express.Router();
router.get("/:restaurantId", getMenuByRestaurant);
export default router;
