// src/routes/restaurantRoutes.js
import express from "express";
import { getRestaurants, getRestaurantById, createRestaurant } from "../controllers/restaurantController.js";
const router = express.Router();
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", createRestaurant);
export default router;
