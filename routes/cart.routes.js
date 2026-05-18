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
        quantity
    } = req.body;

    if (
        !userId ||
        !ticketId ||
        !quantity
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const cart = await prisma.cart.create({
        data: {
            userId: Number(userId),
            ticketId: Number(ticketId),
            quantity: Number(quantity)
        }
    });

    res.status(201).json(cart);
}));

router.get("/:userId", asyncHandler(async (req, res) => {

    const items = await prisma.cart.findMany({
        where: {
            userId: Number(req.params.userId)
        },
        include: {
            user: true,
            ticket: {
                include: {
                    promotion: true
                }
            }
        }
    });

    res.json(items);
}));

router.get("/count/:userId", asyncHandler(async (req, res) => {

    const items = await prisma.cart.findMany({
        where: {
            userId: Number(req.params.userId)
        }
    });

    res.json({
        count: items.length
    });
}));

router.put("/:id", asyncHandler(async (req, res) => {

    const { quantity } = req.body;

    const item = await prisma.cart.update({
        where: {
            id: Number(req.params.id)
        },
        data: {
            quantity: Number(quantity)
        }
    });

    res.json(item);
}));

router.delete("/:id", asyncHandler(async (req, res) => {

    await prisma.cart.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.sendStatus(204);
}));

export default router;