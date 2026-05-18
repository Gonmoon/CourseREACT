import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {
    const {
        userId,
        items,
        totalPrice
    } = req.body;

    if (
        !userId ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !totalPrice
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const createdOrders = await prisma.$transaction(
        items.map((item) => {
            const itemTotalPrice = Number(item.price) * Number(item.quantity);
            
            return prisma.order.create({
                data: {
                    userId: Number(userId),
                    ticketId: Number(item.ticketId),
                    quantity: Number(item.quantity),
                    totalPrice: itemTotalPrice
                }
            });
        })
    );

    res.status(201).json({
        id: createdOrders[0]?.id,
        subOrders: createdOrders,
        totalPrice: Number(totalPrice)
    });
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