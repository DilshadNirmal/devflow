import mongoose from "mongoose";

export const pipelineSchema = new mongoose.Schema(
  {
    project: {
      ref: "Project",
      type: mongoose.Schema.Types.ObjectId,
    },
    docker_image: {
      type: String,
    },
    steps: [{ name: String, command: String }],
    env_vars: [{ key: String, value: String }],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
