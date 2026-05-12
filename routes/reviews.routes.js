import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const review = await prisma.review.create({
            data: {
                comment: req.body.comment,
                userId: Number(req.body.userId),
                orderId: Number(req.body.orderId)
            }
        });
        res.json(review);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
});

export default router;