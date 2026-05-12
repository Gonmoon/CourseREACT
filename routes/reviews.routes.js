import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {
    const review = await prisma.review.create({
        data: {
            comment: req.body.comment,
            userId: Number(req.body.userId),
            orderId: Number(req.body.orderId)
        }
    });
    res.json(review);
}));

// Дописать получение на товар
// router.get("/:idTicket", asyncHandler(async (req, res) => {
router.get("/", asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
}));

export default router;