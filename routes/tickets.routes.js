import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

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
}));

router.get("/", asyncHandler(async (req, res) => {

    const tickets = await prisma.ticket.findMany({
       include: {
            promotions: true
        }
    });

    res.json(tickets);
}));

router.get("/search", asyncHandler(async (req, res) => {

    const q = String(req.query.q || "");
    const tickets = await prisma.ticket.findMany({
        where: {
            title: {
                contains: q
            }
        }
    });

    console.log(tickets);

    if(tickets.length === 0) {
        res.json({ answer : "Не найдено"});
    }

    res.json(tickets);
}));


router.get("/page", asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const tickets = await prisma.ticket.findMany({
        skip: (page - 1) * limit,
        take: limit
    });

    if(tickets.length === 0) {
        res.json({ answer : "Не найдено"});
    }

    res.json(tickets);
}));

router.get("/sort/price-asc", asyncHandler(async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            basePrice: "asc"
        }
    });
    res.json(tickets);
}));

router.get("/sort/price-desc", asyncHandler(async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            basePrice: "desc"
        }
    });
    res.json(tickets);
}));

router.get("/sort/date-asc", asyncHandler(async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            dateTime: "asc"
        }
    });
    res.json(tickets);
}));

router.get("/sort/date-desc", asyncHandler(async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            dateTime: "desc"
        }
    });
    res.json(tickets);
}));

router.get("/sort/stock-desc", asyncHandler(async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            stock: "desc"
        }
    });
    res.json(tickets);
}));

router.get("/:id", asyncHandler(async (req, res) => {

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });

    res.json(ticket);
}));

router.put("/:id", asyncHandler(async (req, res) => {

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
