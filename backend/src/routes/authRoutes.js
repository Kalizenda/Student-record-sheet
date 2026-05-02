import express from "express";
import {
    registerStudent,
    loginStudent,
    loginAdmin,
    createUser
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);
router.post("/admin/login", loginAdmin);
router.post("/admin/create-user", protect, adminOnly, createUser);

export default router;