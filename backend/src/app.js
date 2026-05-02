import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);

// Serve frontend static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../../frontend")));

// Serve specific pages for clean routing
app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/admin-login.html"));
});

app.get("/student-login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/student-login.html"));
});

app.get("/student-register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/student-register.html"));
});

app.get("/admin-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/admin-dashboard.html"));
});

app.get("/student-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/student-dashboard.html"));
});

export default app;