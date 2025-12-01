// src/controllers/menuAdminController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const adminCreateMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, description, price, imageUrl } = req.body;
    const item = await prisma.menuItem.create({ data: { restaurantId, name, description, price, imageUrl }});
    const io = getIo(); if (io) io.emit("menu:created", item);
    res.json(item);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to create menu item" }); }
};
export const adminUpdateMenuItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, imageUrl } = req.body;
    const item = await prisma.menuItem.update({ where:{ id }, data:{ name, description, price, imageUrl }});
    const io = getIo(); if (io) io.emit("menu:updated", item);
    res.json(item);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update menu item" }); }
};
export const adminDeleteMenuItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.menuItem.delete({ where: { id }});
    const io = getIo(); if (io) io.emit("menu:deleted", { id });
    res.json({ message: "Menu item deleted" });
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to delete menu item" }); }
};
