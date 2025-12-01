// src/routes/payfastRoutes.js
import express from "express";
import querystring from "querystring";
const router = express.Router();
const buildSignature = (params) => {
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
  return require('crypto').createHash('md5').update(string).digest('hex');
};
router.post("/checkout", async (req, res) => {
  try {
    const { amount, item_name, return_url, cancel_url, notify_url, merchant_order_id } = req.body;
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const baseUrl = process.env.PAYFAST_BASE_URL;
    const data = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url,
      cancel_url,
      notify_url,
      m_payment_id: merchant_order_id,
      amount: parseFloat(amount).toFixed(2),
      item_name: item_name || `Order ${merchant_order_id}`,
    };
    const signature = buildSignature(data);
    data['signature'] = signature;
    const qs = querystring.stringify(data);
    const redirectUrl = `${baseUrl}?${qs}`;
    res.json({ redirectUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to initiate PayFast payment" });
  }
});
export default router;
