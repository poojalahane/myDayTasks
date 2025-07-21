// Local Imports
import { BadRequestError } from "../errors";
import { BaseModel } from "./base.model";

export class Todo extends BaseModel {
  taskName: string;
  taskDescription: string;
  taskDueDate: Date;
  updatedAt?: Date;

  constructor(taskName: string, taskDescription: string, taskDueDate: Date) {
    super();

    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.taskDueDate = taskDueDate;
  }

  validate(): void {
    if (!this.taskName) throw new BadRequestError("Can not find task name.");
    if (!this.taskName)
      throw new BadRequestError("Can not find task description.");
    if (!this.taskName)
      throw new BadRequestError("Can not find task due date.");
  }

  toJSON(): Record<string, any> {
    return {
      ...this,
    };
  }

  static fromJSON(body: any): BaseModel {
    return new Todo(body.taskName, body.taskDescription, body.taskDueDate);
  }

  static fromSQL(record: any): BaseModel {
    return new Todo(
      record.taskName,
      record.taskDescription,
      record.taskDueDate
    );
  }
}

BaseModel.CLASS_TO_TABLE_MAP["Todo"] = "todos";
BaseModel.ENDPOINT_TO_CLASS_MAP["todos"] = Todo;
