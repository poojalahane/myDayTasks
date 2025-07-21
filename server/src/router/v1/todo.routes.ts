// Imports
import { NextFunction, Response, Request, Router } from "express";

// Local Imports
import { TodoController } from "../../controllers/todo.controller";
import { container } from "../../inversify.config";
import { ApiRequest } from "../../types";

const todoController = container.get<TodoController>(TodoController);
const router = Router();

router.post("/create", (req: ApiRequest, res: Response, next: NextFunction) =>
  todoController.create(req, res, next)
);

router.patch("/update", (req: ApiRequest, res: Response, next: NextFunction) =>
  todoController.update(req, res, next)
);

router.get("/", (req: ApiRequest, res: Response, next: NextFunction) =>
  todoController.list(req, res, next)
);

router.get("/:id", (req: ApiRequest, res: Response, next: NextFunction) =>
  todoController.getById(req, res, next)
);

export default router;