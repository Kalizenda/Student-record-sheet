import studentsResult from "../models/studentsResult.post.model.js";
import User from "../models/User.js";

//Create Students result (Admin only)

   const createStudentsResult = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admin can create results" });
        }
        const { matricNumber, ...resultData } = req.body;
        if (!matricNumber) {
            return res.status(400).json({ message: "Matric number required" });
        }
        const user = await User.findOne({ matricNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        resultData.user = user._id;
        const studentResult = await studentsResult.findOneAndUpdate(
            { user: user._id },
            { $set: resultData },
            { new: true, upsert: true }
        );
        // Update user with result reference
        user.results = studentResult._id;
        await user.save();
        res.status(201).json({ message: "Student result created/updated successfully", studentResult });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const allstudents = await studentsResult.find().populate('user', '-password');
        if(!allstudents || allstudents.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }
        res.status(200).json({ message: "Students found", allstudents });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

// Update students Results (Admin only)
const UpdateStudentsResult = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admin can update results" });
        }
        const studentsResultUpdate = await studentsResult.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', '-password');
        if(!studentsResultUpdate) {
            return res.status(404).json({ message: "Student result not found" });
        }
        res.status(200).json({ message: "Student result updated successfully", studentsResultUpdate });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Delete students result
const deleteStudentResults = async (req, res) => {
    try {
        const deleteStudentResult = await studentsResult.findByIdAndDelete(req.params.id);
        if(!deleteStudentResult) {
            return res.status(404).json({ message: "Student result not found" });
        }
        res.status(200).json({ message: "Student result deleted successfully", deleteStudentResult });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}; 

//Student View Own Result
const getOwnStudentResult = async (req, res) => {
    try {
        const studentResult = await studentsResult.findOne({ user: req.user.id }).select("-password");
        if (!studentResult) {
            return res.status(404).json({ message: "Student result not found" });
        }
        res.status(200).json({ message: "Student result found", studentResult });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export { createStudentsResult, getAllStudents, UpdateStudentsResult, deleteStudentResults, getOwnStudentResult };