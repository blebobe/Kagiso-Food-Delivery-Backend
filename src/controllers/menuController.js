// src/controllers/menuController.js
import prisma from "../prisma.js";
export const getMenuByRestaurant = async (req, res) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const items = await prisma.menuItem.findMany({ where: { restaurantId }});
    res.json(items);
  } catch (err) {
    console.error("getMenuByRestaurant error", err);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
};
