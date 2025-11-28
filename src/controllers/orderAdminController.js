// src/controllers/orderAdminController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, restaurant: true, driver: true, items: { include: { menuItem: true } } },
      orderBy: { id: "desc" },
    });
    res.json(orders);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to fetch orders" }); }
};
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const order = await prisma.order.update({ where: { id }, data: { status }, include: { driver: true }});
    const io = getIo();
    if (io) {
      io.to(`order_${id}`).emit("order:status_changed", { orderId: id, status });
      if (order.driverId) io.to(`driver_${order.driverId}`).emit("order:status_changed", { orderId: id, status });
      io.emit("order:status_admin", { orderId: id, status });
    }
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update order status" }); }
};
