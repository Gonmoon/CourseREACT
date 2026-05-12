import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from 'url';

import { prisma } from "./prisma/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
	const app = express();
	const HOST = process.env.HOST;
    const PORT = process.env.PORT || 4200;

	app.use(cors({
		origin: `http://${HOST}:${PORT}`,
		methods: ['GET', 'POST', 'DELETE', 'PUT'],
		allowedHeaders: ['Content-Type', 'Authorization']
	}));

	app.use(helmet());

	app.use(express.json());

	app.use(express.static(path.join(__dirname, "FrontEnd")))


    app.listen(PORT, HOST, () => {
        console.log(`🚀 Сервер запущен: http://${HOST}:${PORT}`);
    });
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});