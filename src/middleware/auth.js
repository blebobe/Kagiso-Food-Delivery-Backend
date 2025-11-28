// src/middleware/auth.js
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

export default async function auth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ message: "Invalid token" });
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
