import { ProjectModel } from "../models/models";

const createProject = async (projectData: any) => {
  try {
    return await ProjectModel.create(projectData);
  } catch (error) {
    throw new Error(`Failed to create project: ${projectData.name}`);
  }
};

const getAllProjects = async () => {
  try {
    return await ProjectModel.find({});
  } catch (error) {
    throw new Error("Failed to fetch projects");
  }
};

const getProjectById = async (projectId: string) => {
  try {
    return await ProjectModel.findById(projectId);
  } catch (error) {
    throw new Error(`Failed to fetch project with id ${projectId}`);
  }
};

const deleteProject = async (projectId: string) => {
  try {
    return await ProjectModel.findByIdAndDelete(projectId);
  } catch (error) {
    throw new Error(`Failed to delete project with id ${projectId}`);
  }
};

export { createProject, getAllProjects, getProjectById, deleteProject };
