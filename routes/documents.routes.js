import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

    const {
        type,
        orderId
    } = req.body;

    if (
        !type ||
        !orderId
    ) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const document = await prisma.orderDocument.create({
        data: {
            type: type, // PDF DOCX
            orderId: Number(orderId)
        }
    });

    res.status(201).json(document);
}));

router.get("/", asyncHandler(async (req, res) => {

    const documents = await prisma.orderDocument.findMany({
        include: {
            order: true
        }
    });

    res.json(documents);
}));

// Вряд-ли использую, но пускай будет)
router.get("/order/:orderId", asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    const documents = await prisma.orderDocument.findMany({
        where: {
            orderId: Number(orderId)
        }
    });

    if (documents.length === 0) {
        return res.json({
            message: "Документы для этого заказа не найдены"
        });
    }

    res.json(documents);
}));

export default router;