import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {
    const promo = await prisma.promotion.create({
        data: {
            ticketId: Number(req.body.ticketId),
            title: req.body.title,
            discount: Number(req.body.discount),
            validUntil: new Date(req.body.validUntil)
        }
    });
    res.json(promo);
}));

router.get("/", asyncHandler(async (req, res) => {
    const promos = await prisma.promotion.findMany();
    res.json(promos);
}));

router.put("/:id", asyncHandler(async (req, res) => {
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
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    await prisma.promotion.delete({
        where: {
            id: Number(req.params.id)
        }
    });
    res.sendStatus(204);
}));

export default router;
