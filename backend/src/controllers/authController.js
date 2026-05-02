import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Admin creates student user record
const createUser = async (req, res) => {
    try {
        const { studentName, matricNumber } = req.body;
        if (!studentName || !matricNumber) {
            return res.status(400).json({ message: "Student name and matric number required" });
        }

        const existingUser = await User.findOne({ matricNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            studentName,
            username: matricNumber,
            matricNumber,
            password: "tempPassword123"
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                studentName: user.studentName,
                matricNumber: user.matricNumber
            }
        });
    } catch (error) {
        console.error("Create user error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Register Student
const registerStudent = async (req, res) => {
    try {
        const { studentName, matricNumber, password } = req.body;
        if (!studentName || !matricNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ studentName, matricNumber });
        if (!user) {
            return res.status(400).json({ message: "No student record found. Please contact admin." });
        }

        // Check if student already registered by comparing against known temp password hash
        const isTempPassword = await bcrypt.compare("tempPassword123", user.password);
        if (!isTempPassword) {
            return res.status(400).json({ message: "Student already registered. Please log in." });
        }

        user.password = password;
        user.isPasswordSet = true;
        await user.save();

        return res.status(201).json({
            token: generateToken(user._id, "student"),
            message: "Student registered successfully"
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Login Student
const loginStudent = async (req, res) => {
    try {
        const { matricNumber, password } = req.body;
        if (!matricNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const student = await User.findOne({ matricNumber });
        if (!student) {
            return res.status(400).json({ message: "Invalid matric number" });
        }

        const match = await bcrypt.compare(password, student.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid password" });
        }

        return res.status(200).json({
            token: generateToken(student._id, "student"),
            message: "Login successful"
        });
    } catch (error) {
        console.error("Student login error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return res.status(200).json({
                token: generateToken("admin", "admin"),
                message: "Admin login successful"
            });
        }
        return res.status(400).json({ message: "Invalid admin credentials" });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { registerStudent, loginStudent, loginAdmin, createUser };