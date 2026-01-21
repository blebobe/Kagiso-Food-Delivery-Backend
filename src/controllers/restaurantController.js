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
    console.log("BODY RECEIVED:", req.body);
    const { name, description, location, } = req.body;

    if (!name || !location) {
      return res.status(400).json({ 
        message: "Name and location are required"
     });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description: description || "",
        location
        
      }
    });
    //  Sending Response 
    return res.status(201).json(restaurant);

  } catch (error) {
    console.error("CREATE RESTAURANT ERROR:", error);

    return res.status(500).json({ 
     message: "Failed to create restaurant", 
     error: error.message,  
    });
  }
};
