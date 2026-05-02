import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Metaphysics", "Epistemology", "Psychology"]
  },
  score: {
    type: Number,
    required: true
  },
  grade: {
    type: String
  }
});

const studentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  level: String,

  results: [subjectSchema]

}, { timestamps: true });

export default mongoose.model("StudentResult", studentResultSchema);