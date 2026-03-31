import mongoose from "mongoose";

import { runSchema } from "./schemas/run.schema";
import { pipelineSchema } from "./schemas/pipeline.schema";
import { projectSchema } from "./schemas/project.schema";

const ProjectModel = mongoose.model("Project", projectSchema);
const PipelineModel = mongoose.model("Pipeline", pipelineSchema);
const RunModel = mongoose.model("Run", runSchema);

export { ProjectModel, PipelineModel, RunModel };
