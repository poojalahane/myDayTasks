// Imports
import { inject, injectable } from "inversify";
import { Pool } from "pg";

// Local Imports
import { db } from "../lib/db";
import { QueryBuilder } from "../lib/query-builder";
import {
  cacheDelete,
  cacheGet,
  cacheSet,
  generateCacheKey,
} from "../utils/redis.utils";
import { Logger } from "winston";

@injectable()
export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected queryBuilder: QueryBuilder<T>;
  protected abstract logger: Logger;

  constructor(protected client: Pool = db) {
    this.queryBuilder = new QueryBuilder<T>();
  }

  /**
   * Find all records with optional pagination and filtering.
   * @param { Partial<T> = {} } filters Optional filters for the query
   * @param { number } limit Number of records to return ( pagination )
   * @param { number } offset Offset for Pagination
   */
  async findAll(
    filters: Partial<T> = {},
    limit: number = 10,
    offset: number = 0
  ): Promise<T[]> {
    const whereClause = this.queryBuilder.buildWhereClause(filters);
    const query = `SELECT * FROM ${this.tableName} ${whereClause.whereClause} LIMIT $1 OFFSET $2`;
    const cacheKey = generateCacheKey(this.tableName, whereClause.whereClause);

    const cachedFind = await cacheGet<T[]>(cacheKey);

    if (cachedFind) {
      this.logger.info(`Found from cache using key: ${cacheKey}`);
      return cachedFind;
    }

    const result = await this.queryBuilder.query(query, [limit, offset]);

    // Log the action
    this.logger.info(`Fetched from database using query: ${query}`);

    await cacheSet(cacheKey, result, 60 * 60 * 24);

    return result.rows;
  }

  /**
   * Find a single record by its primary key.
   * @param {string } id The primary key of the record to find
   */
  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`;
    const cacheKey = generateCacheKey(this.tableName, id);

    const cachedFind = await cacheGet<T>(cacheKey);

    if (cachedFind) {
      this.logger.info(`Found item in cache using key: ${cacheKey}`);
      return cachedFind;
    }

    const result = await this.queryBuilder.query(query, [id]);

    // Log the action
    this.logger.info(`Found item in database using query: ${query}`);

    await cacheSet(cacheKey, result, 60 * 60 * 24);

    return result.rows[0] || null;
  }

  /**
   * Insert a new record.
   * @param { Partial<T> } entity The data to insert
   */
  async create(entity: Partial<T>): Promise<T> {
    const { columns, values, placeholders } =
      this.queryBuilder.buildInsertClause(entity);
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

    const result = await this.queryBuilder.query(query, values);
    const cacheKey = generateCacheKey(this.tableName, result.rows[0].id);

    // Log the action
    this.logger.info(`Created the entity using query: ${query}`);

    await cacheSet(cacheKey, result, 60 * 60 * 24);

    return result.rows[0];
  }

  /**
   * Update a record by its primary key.
   * @param { string } id The primary key of the record to update
   * @param { Partial<T> } updates The fields to update
   */
  async update(id: string, updates: Partial<T>): Promise<T> {
    const { setClause, values } = this.queryBuilder.buildUpdateClause(updates);
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`;
    const cacheKey = generateCacheKey(this.tableName, id);

    const result = await this.queryBuilder.query(query, [id, ...values]);

    // Log the action
    this.logger.info(`Updated the entity using query: ${query}`);
    await cacheSet(cacheKey, result, 60 * 60 * 24);

    return result.rows[0];
  }

  /**
   * Delete a record by its primary key.
   * Supports soft deletion if enabled by the subclass.
   * @param { string } id The primary key of the record to delete
   */
  async delete(id: string): Promise<void> {
    const cacheKey = generateCacheKey(this.tableName, id);
    let query;

    if (this.supportsSoftDelete()) {
      query = `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1`;
      await this.queryBuilder.query(query, [id]);
    } else {
      query = `DELETE FROM ${this.tableName} WHERE id = $1`;
      await this.queryBuilder.query(query, [id]);
    }

    // Log the action
    this.logger.info(`Deleted the entity using query: ${query}`);

    await cacheDelete(cacheKey);
  }

  /**
   * Helper to check if the repository supports soft deletion.
   */
  protected supportsSoftDelete(): boolean {
    return false; // Override in subclass if needed
  }
}
