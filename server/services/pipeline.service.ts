import { PipelineModel } from "../models/models";

const createPipeline = async (pipelineData: any) => {
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

const updatePipeline = async (pipelineId: string, pipelineData: any) => {
  try {
    return await PipelineModel.findByIdAndUpdate(pipelineId, pipelineData, {
      new: true,
    });
  } catch (error) {
    throw new Error(`Failed to update pipeline with id ${pipelineId}`);
  }
};

export { createPipeline, getPipelineByProjectId, updatePipeline };
