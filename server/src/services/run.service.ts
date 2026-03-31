import { RunModel } from "../models/models";
import { CreateRun } from "../types";

const createRun = async (pipelineId: string, runData: CreateRun) => {
  try {
    await RunModel.create({ ...runData, pipeline: pipelineId });
  } catch (error) {
    throw new Error(`Failed to create run for pipeline with id ${pipelineId}`);
  }
};

const getRunsByProjectId = async (projectId: string) => {
  try {
    return await RunModel.find({ project: projectId });
  } catch (error) {
    throw new Error(`Failed to fetch runs for project with id ${projectId}`);
  }
};

const getRunById = async (runId: string) => {
  try {
    return await RunModel.findById(runId);
  } catch (error) {
    throw new Error(`Failed to fetch run with id ${runId}`);
  }
};

export { createRun, getRunsByProjectId, getRunById };
