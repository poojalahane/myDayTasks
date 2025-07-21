// Imports 
import { inject, injectable } from "inversify";
import { Logger } from "winston";

// Local Imports
import { Todo } from "../models/todo.model";
import { TodoService } from "../services/todo.service";
import { BaseController } from "./base.controller";

@injectable() 
export class TodoController extends BaseController<Todo> {
    constructor(
        @inject(TodoService) protected service: TodoService,
        @inject("todosLogger") protected logger: Logger
    ) {
        super();
    }
}