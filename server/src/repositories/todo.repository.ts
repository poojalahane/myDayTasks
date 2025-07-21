// Imports
import { inject, injectable } from "inversify";

// Local Imports
import { Todo } from "../models/todo.model";
import { BaseRepository } from "./base.repository";
import { container } from "../inversify.config";
import { Logger } from "winston";

@injectable()
export class TodoRepository extends BaseRepository<Todo> {
  protected tableName: string = "todos";

  constructor(@inject("todosLogger") protected logger: Logger) {
    super();
  }
}
