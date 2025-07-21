// Imports
import "reflect-metadata";
import { Container } from "inversify";
import { Logger } from "winston";

// Local Imports
import { createEntityLogger } from "./logging/logger.factory";

// Import Repositories
import { TodoRepository } from "./repositories/todo.repository";

// Import Services
import { TodoService } from "./services/todo.service";

// Import Controllers
import { TodoController } from "./controllers/todo.controller";

// ----------------------------------------------
// Initialise Container
// ----------------------------------------------
const container = new Container();

// ----------------------------------------------
// Bind Repositories
// ----------------------------------------------
container.bind<TodoRepository>(TodoRepository).toSelf();

// ----------------------------------------------
// Bind Services
// ----------------------------------------------
container.bind<TodoService>(TodoService).toSelf();

// ----------------------------------------------
// Bind Controllers
// ----------------------------------------------
container.bind<TodoController>(TodoController).toSelf();

// ----------------------------------------------
// Bind Loggers
// ----------------------------------------------
container
  .bind<Logger>("requestLogger")
  .toConstantValue(createEntityLogger("requestLogger"));

container
  .bind<Logger>("redisLogger")
  .toConstantValue(createEntityLogger("redisLogger"));

container
  .bind<Logger>("todosLogger")
  .toConstantValue(createEntityLogger("todosLogger"));

export { container };
