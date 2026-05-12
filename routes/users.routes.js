import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: req.body
        });

        res.json(user);

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });

        res.json(user);

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.sendStatus(204);

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;