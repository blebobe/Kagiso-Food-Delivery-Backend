// src/controllers/driverAdminController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const adminCreateDriver = async (req, res) => {
  try {
    const { name, phone, vehicle } = req.body;
    const driver = await prisma.driver.create({ data: { name, phone, vehicle, isAvailable: true }});
    const io = getIo(); if (io) io.emit("driver:created", driver);
    res.json(driver);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to create driver" }); }
};
export const adminAssignDriver = async (req, res) => {
  try {
    const { driverId, orderId } = req.body;
    const order = await prisma.order.update({ where: { id: Number(orderId) }, data: { driverId: Number(driverId), status: "assigned" }, include: { user: true, restaurant: true, driver: true }});
    await prisma.driver.update({ where: { id: Number(driverId) }, data: { isAvailable: false }});
    const io = getIo();
    if (io) {
      io.to(`order_${orderId}`).emit("order:assigned", { orderId: Number(orderId), driverId: Number(driverId), driver: order.driver });
      io.to(`driver_${driverId}`).emit("assigned:order", { orderId: Number(orderId), userId: order.user.id });
      io.emit("driver:status_changed", { driverId: Number(driverId), isAvailable: false });
    }
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to assign driver" }); }
};
export const adminToggleDriverAvailability = async (req, res) => {
  try {
    const driverId = Number(req.params.id);
    const { isAvailable } = req.body;
    const driver = await prisma.driver.update({ where: { id: driverId }, data: { isAvailable }});
    const io = getIo(); if (io) io.emit("driver:status_changed", { driverId, isAvailable });
    res.json(driver);
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update driver availability" }); }
};
export const adminUpdateDriverLocation = async (req, res) => {
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
  } catch (err) { console.error(err); res.status(500).json({ message: "Failed to update driver location" }); }
};
