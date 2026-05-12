import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const order = await prisma.web_Order.create({
            data: {
                userId: Number(req.body.userId),
                totalAmount: Number(req.body.totalAmount)
            }
        });
        res.json(order);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const orders = await prisma.web_Order.findMany();
    res.json(orders);
});

export default router;
