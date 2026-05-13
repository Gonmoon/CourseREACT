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
        discount
    } = req.body;

    if (
        !title ||
        !description ||
        !discount
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const promotion = await prisma.promotion.create({
        data: {
            title,
            description,
            discount: Number(discount)
        }
    });

    res.status(201).json(promotion);
}));

router.get("/", asyncHandler(async (req, res) => {

    const promotions = await prisma.promotion.findMany({
        include: {
            tickets: true
        }
    });

    res.json(promotions);
}));

router.get("/:id", asyncHandler(async (req, res) => {

    const promotion = await prisma.promotion.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            tickets: true
        }
    });

    if (!promotion) {
        return res.status(404).json({
            message: "Акция не найдена"
        });
    }

    res.json(promotion);
}));

router.put("/:id", asyncHandler(async (req, res) => {

    const {
        title,
        description,
        discount
    } = req.body;

    const promotion = await prisma.promotion.update({
        where: {
            id: Number(req.params.id)
        },
        data: {
            title,
            description,
            discount: discount
                ? Number(discount)
                : undefined
        }
    });

    res.json(promotion);
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