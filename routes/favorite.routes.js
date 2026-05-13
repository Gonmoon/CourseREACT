import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

    const {
        userId,
        ticketId
    } = req.body;

    if (
        !userId ||
        !ticketId
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const favorite = await prisma.favorite.create({
        data: {
            userId: Number(userId),
            ticketId: Number(ticketId)
        }
    });

    res.status(201).json(favorite);
}));

router.get("/:userId", asyncHandler(async (req, res) => {

    const items = await prisma.favorite.findMany({
        where: {
            userId: Number(req.params.userId)
        },
        include: {
            ticket: true,
            user: true
        }
    });

    res.json(items);
}));

router.get("/count/:userId", asyncHandler(async (req, res) => {

    const items = await prisma.favorite.findMany({
        where: {
            userId: Number(req.params.userId)
        }
    });

    res.json({
        count: items.length
    });
}));

router.delete("/:id", asyncHandler(async (req, res) => {

    await prisma.favorite.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.sendStatus(204);
}));

export default router;