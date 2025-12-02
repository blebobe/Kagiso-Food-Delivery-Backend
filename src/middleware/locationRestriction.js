// src/middleware/locationRestriction.js

export function allowOnlyKagiso(req, res, next) {
  const allowedArea = "kagiso";

  const { deliveryAddress } = req.body;

  if (!deliveryAddress) {
    return res.status(400).json({
      message: "Delivery address is required.",
    });
  }

  // Convert to lowercase so checks are not case-sensitive
  const addressLower = deliveryAddress.toLowerCase();

  // Allow ANY address that contains "kagiso"
  if (!addressLower.includes(allowedArea)) {
    return res.status(403).json({
      message: "Sorry, we only deliver inside Kagiso.",
    });
  }

  next();
}
