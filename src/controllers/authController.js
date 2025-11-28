// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email exists" });
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { name, email, password: hashed, role: role || "customer" }});
        res.json({ message: "User registered", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
