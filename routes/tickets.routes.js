import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const ticket = await prisma.ticket.create({
            data: {
                title: req.body.title,
                posterUrl: req.body.posterUrl,
                dateTime: new Date(req.body.dateTime),
                basePrice: Number(req.body.basePrice),
                stock: Number(req.body.stock)
            }
        });
        res.json(ticket);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                promotions: true
            }
        });
        res.json(tickets);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/search", async (req, res) => {
    try {
        const q = String(req.query.q || "");
        const tickets = await prisma.ticket.findMany({
            where: {
                title: {
                    contains: q
                }
            }
        });
        res.json(tickets);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/page", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const tickets = await prisma.ticket.findMany({
            skip: (page - 1) * limit,
            take: limit
        });
        res.json(tickets);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/sort/price-asc", async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            basePrice: "asc"
        }
    });
    res.json(tickets);
});

router.get("/sort/price-desc", async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            basePrice: "desc"
        }
    });
    res.json(tickets);
});

router.get("/:id", async (req, res) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json(ticket);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const ticket = await prisma.ticket.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: req.body.title,
                posterUrl: req.body.posterUrl,
                dateTime: req.body.dateTime
                    ? new Date(req.body.dateTime)
                    : undefined,
                basePrice: Number(req.body.basePrice),
                stock: Number(req.body.stock)
            }
        });
        res.json(ticket);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await prisma.ticket.delete({
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
