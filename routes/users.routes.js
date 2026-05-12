import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

    const user = await prisma.user.create({
        data: req.body
    });

    res.json(user);
}));

router.get("/", asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
}));

router.get("/:id", asyncHandler(async (req, res) => {

    const user = await prisma.user.findUnique({
        where: {
            id: Number(req.params.id)
        },
    });

    res.json(user);
}));

router.put("/:id", asyncHandler(async (req, res) => {

    const { email, ...updateData } = req.body;

    const user = await prisma.user.update({
        where: {
            id: Number(req.params.id)
        },
        data: updateData
    });

    res.json(user);
}));

router.delete("/:id", asyncHandler(async (req, res) => {

    await prisma.user.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.sendStatus(204);
}));

export default router;