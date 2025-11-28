// src/routes/payfastWebhook.js
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import axios from "axios";
import prisma from "../prisma.js";
const router = express.Router();
router.post("/notify", bodyParser.urlencoded({ extended: true }), async (req, res) => {
  try {
    const params = req.body;
    const keys = Object.keys(params).sort();
    const pairs = [];
    for (const k of keys) {
      if (params[k] !== undefined && params[k] !== null && params[k] !== "") {
        pairs.push(`${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`);
      }
    }
    let string = pairs.join('&');
    if (process.env.PAYFAST_PASSPHRASE) {
      string = `${string}&passphrase=${encodeURIComponent(process.env.PAYFAST_PASSPHRASE)}`;
    }
    const mySig = crypto.createHash('md5').update(string).digest('hex');
    if (!params.signature || mySig !== params.signature.toLowerCase()) {
      console.warn('PayFast signature mismatch', { mySig, remoteSig: params.signature });
      return res.status(400).send('invalid_signature');
    }
    const validateUrl = process.env.PAYFAST_MODE === 'live'
      ? 'https://www.payfast.co.za/eng/query/validate'
      : 'https://sandbox.payfast.co.za/eng/query/validate';
    const validatePayload = {};
    Object.keys(params).forEach(k => {
      if (k !== 'signature') validatePayload[k] = params[k];
    });
    const resValidate = await axios.post(validateUrl, new URLSearchParams(validatePayload).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (resValidate.data !== 'VALID') {
      console.warn('PayFast notify validation failed', resValidate.data);
      return res.status(400).send('invalid');
    }
    const merchantOrderId = params.m_payment_id;
    const paymentStatus = params.payment_status;
    await prisma.order.update({
      where: { id: Number(merchantOrderId) },
      data: { status: paymentStatus === 'COMPLETE' ? 'paid' : 'payment_failed' }
    });
    res.status(200).send('OK');
  } catch (err) {
    console.error('PayFast webhook error', err);
    res.status(500).send('error');
  }
});
export default router;
