import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

    const {
        title,
        description,
        price,
        eventDate,
        posterUrl,
        quantity,
        promotionId
    } = req.body;

    if (
        !title ||
        !description ||
        !price ||
        !eventDate ||
        !posterUrl ||
        !quantity ||
        !promotionId
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const ticket = await prisma.ticket.create({
        data: {
            title,
            description,
            price: Number(price),
            eventDate: new Date(eventDate),
            posterUrl,
            quantity: Number(quantity),
            promotionId: Number(promotionId)
        }
    });

    res.status(201).json(ticket);
}));

router.get("/", asyncHandler(async (req, res) => {

    const tickets = await prisma.ticket.findMany({
        include: {
            promotion: true
        }
    });

    res.json(tickets);
}));

router.get("/page", asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const sort = req.query.sort;
    const q = String(req.query.q || "");

    const sortMap = {
        'price-asc': { price: 'asc' },
        'price-desc': { price: 'desc' },
        'date-asc': { eventDate: 'asc' },
        'date-desc': { eventDate: 'desc' },
    };

    const tickets = await prisma.ticket.findMany({
        where: {
            title: {
                contains: q,
            },
        },
        orderBy: sortMap[sort] || undefined,
        skip: (page - 1) * limit,
        take: limit,
    });

    res.json(tickets);
}));

router.get("/:id", asyncHandler(async (req, res) => {

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            promotion: true
        }
    });

    if (!ticket) {
        return res.status(404).json({
            message: "Билет не найден"
        });
    }

    res.json(ticket);
}));

router.put("/:id", asyncHandler(async (req, res) => {

    const {
        title,
        description,
        price,
        eventDate,
        posterUrl,
        quantity,
        promotionId
    } = req.body;

    const ticket = await prisma.ticket.update({
        where: {
            id: Number(req.params.id)
        },
        data: {
            title,
            description,
            price: price ? Number(price) : undefined,
            eventDate: eventDate
                ? new Date(eventDate)
                : undefined,
            posterUrl,
            quantity: quantity ? Number(quantity) : undefined,
            promotionId: promotionId
                ? Number(promotionId)
                : undefined
        }
    });

    res.json(ticket);
}));

router.delete("/:id", asyncHandler(async (req, res) => {

    await prisma.ticket.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.sendStatus(204);
}));

export default router;