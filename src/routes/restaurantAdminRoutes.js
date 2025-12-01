// src/routes/restaurantAdminRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { adminCreateRestaurant, adminUpdateRestaurant, adminDeleteRestaurant } from "../controllers/restaurantAdminController.js";
const router = express.Router();
router.post("/", auth, admin, adminCreateRestaurant);
router.put("/:id", auth, admin, adminUpdateRestaurant);
router.delete("/:id", auth, admin, adminDeleteRestaurant);
export default router;
