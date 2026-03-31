import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema(
  {
    repo_name: {
      type: String,
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    repo_url: {
      type: String,
      required: true,
    },
    webhook_id: {
      type: String,
      required: true,
    },
    webhook_secret: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
