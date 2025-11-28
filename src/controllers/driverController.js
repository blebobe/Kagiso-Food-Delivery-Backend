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
