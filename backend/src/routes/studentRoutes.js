import { Router } from "express";
import {
    createStudentsResult,
    getAllStudents,
    UpdateStudentsResult,
    deleteStudentResults,
    getOwnStudentResult
} from "../controllers/studentsResult-postController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Admin routes (protected)
router.post("/admin-add-result", protect, adminOnly, createStudentsResult);
router.get("/allstudents", protect, adminOnly, getAllStudents);
router.put("/update/:id", protect, adminOnly, UpdateStudentsResult);
router.delete("/delete/:id", protect, adminOnly, deleteStudentResults);

// Student route (protected)
router.get("/my-own-result", protect, getOwnStudentResult);

export default router;