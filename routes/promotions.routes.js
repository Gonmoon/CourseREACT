import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const promo = await prisma.promotion.create({
            data: {
                ticketId: Number(req.body.ticketId),
                title: req.body.title,
                discount: Number(req.body.discount),
                validUntil: new Date(req.body.validUntil)
            }
        });
        res.json(promo);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const promos = await prisma.promotion.findMany();
    res.json(promos);
});

router.put("/:id", async (req, res) => {
    try {
        const promo = await prisma.promotion.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: req.body.title,
                discount: Number(req.body.discount)
            }
        });
        res.json(promo);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await prisma.promotion.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.sendStatus(204);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
