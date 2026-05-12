import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/", asyncHandler(async (req, res) => {
    const history = await prisma.history.findMany({
        include: {
            order: true
        }
    });
    res.json(history);
}));

export default router;