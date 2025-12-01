// src/controllers/restaurantAdminController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const adminCreateRestaurant = async (req, res) => {
  try {
    const { name, description, imageUrl, address } = req.body;
    const restaurant = await prisma.restaurant.create({ data: { name, description, imageUrl, address }});
    const io = getIo(); if (io) io.emit("restaurant:created", restaurant);
    res.json(restaurant);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to create restaurant" }); }
};
export const adminUpdateRestaurant = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, imageUrl, address } = req.body;
    const restaurant = await prisma.restaurant.update({ where:{ id }, data:{ name, description, imageUrl, address }});
    const io = getIo(); if (io) io.emit("restaurant:updated", restaurant);
    res.json(restaurant);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update restaurant" }); }
};
export const adminDeleteRestaurant = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.restaurant.delete({ where: { id }});
    const io = getIo(); if (io) io.emit("restaurant:deleted", { id });
    res.json({ message: "Restaurant deleted" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to delete restaurant" }); }
};
