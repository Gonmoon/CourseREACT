import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import usersRoutes from "./routes/users.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import promotionsRoutes from "./routes/promotions.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import historyRoutes from "./routes/history.routes.js";
import documentsRoutes from "./routes/documents.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
		hsts: false
	})
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "FrontEnd")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "FrontEnd", "index.html"));
});

app.use("/api/users", usersRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/documents", documentsRoutes);

app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(` Server running: http://${process.env.HOST}:${process.env.PORT}`);
});