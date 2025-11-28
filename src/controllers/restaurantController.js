// src/controllers/restaurantController.js
import prisma from "../prisma.js";
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (err) {
    console.error("getRestaurants error", err);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};
export const getRestaurantById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const restaurant = await prisma.restaurant.findUnique({ where: { id }});
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    res.json(restaurant);
  } catch (err) {
    console.error("getRestaurantById error", err);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};
