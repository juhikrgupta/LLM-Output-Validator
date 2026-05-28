import mongoose from "mongoose";

const SchemaModel =
  new mongoose.Schema(

    {
      name: {
        type: String,
        required: true,
        unique: true,
      },

      schema: {
        type: Object,
        required: true,
      },
    },

    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Schema ||

  mongoose.model(
    "Schema",
    SchemaModel
  );