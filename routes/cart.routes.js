import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const item = await prisma.cart_Favorite.create({
            data: {
                userId: Number(req.body.userId),
                ticketId: Number(req.body.ticketId),
                type: req.body.type,
                quantity: Number(req.body.quantity)
            }
        });
        res.json(item);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const items = await prisma.cart_Favorite.findMany({
            where: {
                userId: Number(req.params.userId)
            }
        });
        res.json(items);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;