// src/server.js

// Imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { PrismaClient } from "@prisma/client";
import { Server as SocketServer } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import restaurantAdminRoutes from "./routes/restaurantAdminRoutes.js";
import menuAdminRoutes from "./routes/menuAdminRoutes.js";
import orderAdminRoutes from "./routes/orderAdminRoutes.js";
import driverAdminRoutes from "./routes/driverAdminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import payfastRoutes from "./routes/payfastRoutes.js";
import payfastWebhook from "./routes/payfastWebhook.js";
import setupSwagger from "./swagger.js";
import errorHandler from "./middleware/errorHandler.js";
import { initSocket } from "./socket.js";

// Load env vars
dotenv.config();

// Init app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Init Prisma 
const prisma = new PrismaClient();

// DB Test Route
app.get("/db-test", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ database: "connected ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      database: "connection failed ❌",
      error: error.message,
    });
  }
});

// Routes
app.use(cors());
app.use(express.json());
setupSwagger(app);
app.get("/", (req, res) => res.json({ message: "Food Delivery Backend Running 🚀" }));
app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/drivers", driverRoutes);
app.use("/admin/restaurants", restaurantAdminRoutes);
app.use("/admin/menu", menuAdminRoutes);
app.use("/admin/orders", orderAdminRoutes);
app.use("/admin/drivers", driverAdminRoutes);
app.use("/payments", paymentRoutes);
app.use("/payfast", payfastRoutes);
app.use("/payfast", payfastWebhook);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, { cors: { origin: "*" } });
initSocket(io);
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("driver:join", ({ driverId }) => { socket.join(`driver_${driverId}`); });
  socket.on("order:join", ({ orderId }) => { socket.join(`order_${orderId}`); });
  socket.on("driver:location", (data) => { io.to(`driver_${data.driverId}`).emit("driver:location", data); io.emit("driver:location:global", data); });
  socket.on("disconnect", () => { console.log("Socket disconnected:", socket.id); });
});
httpServer.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
