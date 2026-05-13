import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

    const {
        userId,
        ticketId,
        quantity,
        totalPrice
    } = req.body;

    if (
        !userId ||
        !ticketId ||
        !quantity ||
        !totalPrice
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const order = await prisma.order.create({
        data: {
            userId: Number(userId),
            ticketId: Number(ticketId),
            quantity: Number(quantity),
            totalPrice: Number(totalPrice)
        }
    });

    res.status(201).json(order);
}));

router.get("/", asyncHandler(async (req, res) => {

    const orders = await prisma.order.findMany({
        include: {
            ticket: true,
            user: true
        }
    });

    res.json(orders);
}));

router.get("/:userID", asyncHandler(async (req, res) => {

    const orders = await prisma.order.findMany({
        where: {
            userId: Number(req.params.userID)
        },
        include: {
            ticket: true
        }
    });

    if (orders.length === 0) {
        return res.json({
            message: "Заказы не найдены"
        });
    }

    res.json(orders);
}));

export default router;