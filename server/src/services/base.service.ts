// Imports
import { injectable } from "inversify";
import { BaseRepository } from "../repositories";

@injectable()
export abstract class BaseService<T> {
  protected abstract repository: typeof BaseRepository<T> | any; // Injected repository for data operations

  constructor() {}

  /**
   * Create a new entity
   * @param data - The data to be created
   * @returns - The newly created entity
   */
  async create(data: Partial<T>): Promise<T | null> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      this.handleServiceError(error);
      return null; // Ensures return type consistency
    }
  }

  /**
   * Update an existing entity by ID
   * @param id - The entity's unique ID
   * @param data - The updated data
   * @returns - The updated entity
   */
  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      this.handleServiceError(error);
      return null; // Ensures return type consistency
    }
  }

  /**
   * Find an entity by ID
   * @param id - The entity's unique ID
   * @returns - The found entity or null
   */
  async getById(id: string | number): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      this.handleServiceError(error);
      return null; // Ensures return type consistency
    }
  }

  /**
   * Retrieve all entities (with optional filters, pagination)
   * @param filters - Optional filters for the query
   * @returns - A list of entities
   */
  async list(filters: Record<string, any> = {}): Promise<T[] | []> {
    try {
      return await this.repository.findAll(filters);
    } catch (error) {
      this.handleServiceError(error);
      return []; // Return empty array in case of error
    }
  }

  /**
   * Delete an entity by ID
   * @param id - The entity's unique ID
   */
  async delete(id: string | number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  /**
   * Method to handle service-level errors
   * Can be overridden in specific service implementations
   */
  protected handleServiceError(error: any): void {
    // Default error handling, can be extended by specific services
    console.error("Service Error:", error);
    throw new Error(error.message || "Service Error");
  }
}
