// Imports
import { v4 as uuidv4 } from "uuid";

// Local Imports

export abstract class BaseModel {
  // Maps classes to table names.
  // Each class registers its mapping when imported
  // TODO: create model
  static CLASS_TO_TABLE_MAP: Record<string, string> = {};

  // Maps endpoints to specific classes
  // Each class registers its mapping when imported
  // TODO: create model
  static ENDPOINT_TO_CLASS_MAP: Record<string, any> = {};

  constructor() {
    if (new.target === BaseModel) {
      throw new Error("Cannot instantiate an abstract class.");
    }
  }

  static getPrimaryKey(): string {
    return "id";
  }

  static generatePrimaryKey(): string {
    return uuidv4();
  }

  static getTableName(): string {
    return this.CLASS_TO_TABLE_MAP[this.name] || "";
  }

  static fromEndpoint(endpoint: string): string {
    return this.ENDPOINT_TO_CLASS_MAP[endpoint];
  }

  static fromSQL(record: any) {
    throw new Error("fromSQL must be implemented in child models.");
  }

  static fromJSON(body: any) {
    throw new Error("fromJSON must be implemented in child models.");
  }

  validate(): void {
    throw new Error("Validation logic must be implemented in child models.");
  }

  toJSON(): Record<string, any> {
    const result = { ...this }; // shallow copy of instance;
    return result;
  }
}
