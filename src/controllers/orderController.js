// src/controllers/orderController.js
import prisma from "../prisma.js";
import { getIo } from "../socket.js";
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId, items, subtotal, deliveryAddress, tipPercentage } = req.body;
    
    // Verify restaurant exists and is in Kagiso
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    if (restaurant.location !== "Kagiso") {
      return res.status(403).json({ message: "Can only order from Kagiso restaurants" });
    }
    
    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }
    
    if (!deliveryAddress.includes("Kagiso")) {
      return res.status(403).json({ message: "Delivery address must be in Kagiso" });
    }
    
    // Validate tip percentage if provided (10% to 100%)
    let tip = 0;
    let finalTipPercentage = null;
    if (tipPercentage !== undefined && tipPercentage !== null) {
      if (tipPercentage < 10 || tipPercentage > 100) {
        return res.status(400).json({ message: "Tip must be between 10% and 100%" });
      }
      finalTipPercentage = tipPercentage;
      tip = (parseFloat(subtotal) * tipPercentage) / 100;
    }
    
    // Calculate totals: R25 delivery fee breakdown (R15 driver + R10 platform profit)
    const parsedSubtotal = parseFloat(subtotal);
    const deliveryFee = 25;
    const driverPay = 15;
    const platformProfit = 10;
    const total = parsedSubtotal + deliveryFee + tip;
    
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        deliveryAddress,
        subtotal: parsedSubtotal,
        deliveryFee,
        driverPay,
        platformProfit,
        tip,
        tipPercentage: finalTipPercentage,
        total,
        status: "pending",
        items: {
          create: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        },
      },
      include: { items: { include: { menuItem: true } }, restaurant: true },
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
