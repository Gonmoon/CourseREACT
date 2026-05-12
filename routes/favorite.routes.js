import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {
    const item = await prisma.cart_Favorite.create({
        data: {
            userId: Number(req.body.userId),
            ticketId: Number(req.body.ticketId),
            type: req.body.type,
            quantity: Number(req.body.quantity)
        }
    });
    res.json(item);
}));

router.get("/:userId", asyncHandler(async (req, res) => {
    const items = await prisma.cart_Favorite.findMany({
        where: {
            userId: Number(req.params.userId),
            type: "favorite"
        }
    });
    res.json(items);
}));

router.get("count/:userId", asyncHandler(async (req, res) => {
    const items = await prisma.cart_Favorite.findMany({
        where: {
            userId: Number(req.params.userId),
            type: "favorite"
        }
    });
    res.json(items.length);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    await prisma.cart_Favorite.delete({
        where: {
            id: Number(req.params.id),
            type: "favorite"
        }
    });

    res.sendStatus(204);
}));

export default router;