// Imports
import { inject, injectable } from "inversify";

// Local Imports
import { BaseService } from "./base.service";
import { Todo } from "../models/todo.model";
import { TodoRepository } from "../repositories/todo.repository";

@injectable()
export class TodoService extends BaseService<Todo> {
  constructor(@inject(TodoRepository) protected repository: TodoRepository) {
    super();
  }
}
