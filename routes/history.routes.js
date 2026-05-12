import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const history = await prisma.history.findMany({
            include: {
                order: true
            }
        });
        res.json(history);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;