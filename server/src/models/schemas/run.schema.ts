import mongoose from "mongoose";

export const runSchema = new mongoose.Schema(
  {
    project: {
      ref: "Project",
      type: mongoose.Schema.Types.ObjectId,
    },
    pipeline: {
      ref: "Pipeline",
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["pending", "running", "success", "failed"],
      default: "pending",
    },
    logs: {
      type: [String],
      default: [],
    },
    started_at: {
      type: Date,
      default: Date.now,
    },
    finished_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
