import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handlerInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router: Router = Router();

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es requerido"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es requerido"),
  body("description")
    .notEmpty()
    .withMessage("El nombre de la descripción del proyecto es requerido"),
  handlerInputErrors,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);


router.param("projectId", projectExists);
router.get(
  "/:projectId",
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  handlerInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es requerido"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es requerido"),
  body("description")
    .notEmpty()
    .withMessage("El nombre de la descripción del proyecto es requerido"),
  handlerInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  handlerInputErrors,
  ProjectController.deleteProject
);

// Router fot tasks
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El nombre de la tarea es requerida"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es requerida"),
  handlerInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es requerida"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es requerida"),
  handlerInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  handlerInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  body("status").notEmpty().withMessage("El estado de la tarea es obligatorio"),
  handlerInputErrors,
  TaskController.updateStatus
);

export default router;
