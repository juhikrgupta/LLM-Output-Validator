import mongoose from "mongoose";

const ValidationSchema = new mongoose.Schema({
  prompt: String,
  response: Object,
  success: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Validation ||
  mongoose.model("Validation", ValidationSchema);