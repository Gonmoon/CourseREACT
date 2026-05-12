import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    res.json({
        message: "Document created"
    });
});

router.get("/", async (req, res) => {
    res.json({
        message: "Documents"
    });
});

export default router;