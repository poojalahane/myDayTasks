import { Router } from "express";

// Local Imports
import todoRoutes from "./todo.routes";

const router = Router();

router.use("/todo", todoRoutes);

export default router;
