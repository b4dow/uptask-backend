import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.send("Proyecto creado");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      res.json(req.project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { projectName, clientName, description } = req.body;

    try {
      req.project.projectName = projectName;
      req.project.clientName = clientName;
      req.project.description = description;
      await req.project.save();
      res.send("Proyecto actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();
      res.send("Proyecto eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
