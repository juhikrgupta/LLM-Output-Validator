import mongoose from "mongoose";

const ValidationSchema =
  new mongoose.Schema(

    {
      prompt: {
        type: String,
      },

      schema: {
        type: String,
      },

      response: {
        type: Object,
      },

      success: {
        type: Boolean,
      },

      attempts: {
        type: Number,
        default: 1,
      },

      correctionNeeded: {
        type: Boolean,
        default: false,
      },

      latency: {
        type: String,
      },

      errors: [
        {
          path: [String],
          message: String,
        },
      ],
    },

    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Validation ||

  mongoose.model(
    "Validation",
    ValidationSchema
  );