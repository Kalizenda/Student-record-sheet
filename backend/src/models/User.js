import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPasswordSet: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  results: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentsResult",
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
