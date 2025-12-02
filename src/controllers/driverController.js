// src/controllers/driverController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({ where: { isAvailable: true }});
    res.json(drivers);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to fetch drivers" }); }
};
export const updateDriverLocation = async (req, res) => {
  try {
    const driverId = Number(req.params.id);
    const { lat, lng } = req.body;
    const driver = await prisma.driver.update({ where: { id: driverId }, data: { lat: Number(lat), lng: Number(lng) }});
    const io = getIo();
    if (io) {
      io.to(`driver_${driverId}`).emit("driver:location", { driverId, lat: driver.lat, lng: driver.lng, ts: Date.now() });
      io.emit("driver:location_global", { driverId, lat: driver.lat, lng: driver.lng });
    }
    res.json(driver);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update location" }); }
};
export const getDriverEarnings = async (req, res) => {
  try {
    const driverId = Number(req.params.id);
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { orders: true }
    });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({
      id: driver.id,
      name: driver.name,
      totalDeliveries: driver.totalDeliveries,
      totalEarnings: driver.totalEarnings,
      perDelivery: 15,
      orders: driver.orders
    });
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to fetch earnings" }); }
};
export const updateOrderDelivered = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const driverId = Number(req.user.id);
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "delivered" }
    });
    await prisma.driver.update({
      where: { id: order.driverId },
      data: {
        totalDeliveries: { increment: 1 },
        totalEarnings: { increment: order.driverPay }
      }
    });
    const io = getIo();
    if (io) io.to(`order_${orderId}`).emit("order:delivered", { orderId, driverId: order.driverId });
    res.json(updatedOrder);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update delivery status" }); }
};
