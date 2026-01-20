// src/controllers/restaurantController.js
import prisma from "../prisma.js";

// GET all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { location: "Kagiso" }
    });
    res.json(restaurants);
  } catch (err) {
    console.error("getRestaurants error", err);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

// GET restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const restaurant = await prisma.restaurant.findUnique({
      where: { id }
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(restaurant);
  } catch (err) {
    console.error("getRestaurantById error", err);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};

// CREATE restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { name, description, location, isOpen } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        location,
        isOpen: isOpen ?? true
      }
    });

    res.status(201).json(restaurant);
  } catch (err) {
    console.error("createRestaurant error", err);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};
