import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(async (req, res) => {

    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({
            message: "Все поля обязательны"
        });
    }

    const user = await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            password
        }
    });

    res.status(201).json(user);
}));

router.get("/", asyncHandler(async (req, res) => {

    const users = await prisma.user.findMany();

    res.json(users);
}));

router.get("/:id", asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        return res.status(404).json({
            message: "Пользователь не найден"
        });
    }

    res.json(user);
}));

router.put("/:id", asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    const { email, firstName, lastName, password } = req.body;

    const user = await prisma.user.update({
        where: { id },
        data: {
            email,
            firstName,
            lastName,
            password
        }
    });

    res.json(user);
}));

router.delete("/:id", asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    await prisma.user.delete({
        where: { id }
    });

    res.sendStatus(204);
}));

export default router;