// src/controllers/orderController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId, items, total } = req.body;
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        total,
        status: "pending",
        items: {
          create: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        },
      },
      include: { items: true },
    });
    const io = getIo(); if (io) io.emit("order:new", order);
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to place order" }); }
};
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } }, restaurant: true, driver: true },
      orderBy: { id: "desc" },
    });
    res.json(orders);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to fetch orders" }); }
};
export const getOrderById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { menuItem: true } }, restaurant: true, driver: true }});
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to fetch order" }); }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const order = await prisma.order.update({ where: { id }, data: { status }});
    const io = getIo(); if (io) io.to(`order_${id}`).emit("order:status_changed", { orderId: id, status });
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update status" }); }
};
