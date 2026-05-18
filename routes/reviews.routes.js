import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {
    const { content, orderId } = req.body;

    if (!content || !orderId) {
        return res.status(400).json({ message: "Все поля обязательны" });
    }

    const existingReview = await prisma.review.findFirst({
        where: {
            orderId: Number(orderId)
        }
    });

    if (existingReview) {
        return res.status(400).json({ message: "Вы уже оставили отзыв к этому заказу" });
    }

    const review = await prisma.review.create({
        data: {
            content: content,
            orderId: Number(orderId)
        }
    });

    res.status(201).json(review);
}));

router.get("/", asyncHandler(async (req, res) => {

    const reviews = await prisma.review.findMany({
        include: {
            order: true
        }
    });

    res.json(reviews);
}));

router.get("/ticket/:idTicket", asyncHandler(async (req, res) => {

    const { idTicket } = req.params;

    const reviews = await prisma.review.findMany({
        where: {
            order: {
                ticketId: Number(idTicket)
            }
        },
        include: {
            order: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });

    if (reviews.length === 0) {
        return res.json({
            message: "Отзывы не найдены"
        });
    }

    res.json(reviews);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
        where: { id: Number(id) }
    });

    if (!review) {
        return res.status(404).json({ message: "Отзыв не найден" });
    }

    await prisma.review.delete({
        where: { id: Number(id) }
    });

    res.json({ message: "Отзыв успешно удален" });
}));

export default router;