import { PipelineModel } from "../models/models";
import { CreatePipeline } from "../types";

const createPipeline = async (pipelineData: CreatePipeline) => {
  try {
    return await PipelineModel.create(pipelineData);
  } catch (error) {
    throw new Error(
      `Failed to create pipeline for project with id ${pipelineData.project}`,
    );
  }
};

const getPipelineByProjectId = async (projectId: string) => {
  try {
    return await PipelineModel.findOne({ project: projectId });
  } catch (error) {
    throw new Error(
      `Failed to fetch pipeline for project with id ${projectId}`,
    );
  }
};

const updatePipeline = async (
  pipelineId: string,
  pipelineData: Partial<CreatePipeline>,
) => {
  try {
    return await PipelineModel.findByIdAndUpdate(pipelineId, pipelineData, {
      new: true,
    });
  } catch (error) {
    throw new Error(`Failed to update pipeline with id ${pipelineId}`);
  }
};

export { createPipeline, getPipelineByProjectId, updatePipeline };
