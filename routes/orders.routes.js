import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Дописать(переписать)
router.post("/", asyncHandler(async (req, res) => {
    const order = await prisma.web_Order.create({
        data: {
            userId: Number(req.body.userId),
            totalAmount: Number(req.body.totalAmount)
        }
    });
    res.json(order);
}));

router.get("/", asyncHandler(async (req, res) => {
    const orders = await prisma.web_Order.findMany();
    res.json(orders);
}));

export default router;
