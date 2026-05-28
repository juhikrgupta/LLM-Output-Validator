import mongoose from "mongoose";

const ValidationSchema =
  new mongoose.Schema({

    prompt: String,

    response: Object,

    success: Boolean,

  }, {
    timestamps: true,
  });

export default
  mongoose.models.Validation ||

  mongoose.model(
    "Validation",
    ValidationSchema
  );