// src/routes/paymentRoutes.js
import express from "express";
import Stripe from "stripe";
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "zar", metadata } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100),
      currency,
      metadata,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
