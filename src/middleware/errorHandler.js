// src/middleware/errorHandler.js
export default function errorHandler(err, req, res, next) {
    console.error("Error:", err.stack || err);
    res.status(500).json({
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
}
