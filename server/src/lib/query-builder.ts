// Imports
import { PoolClient, QueryConfig, QueryResult } from "pg";

// Local Imports
import { db } from "./db";

export class QueryBuilder<T> {
  constructor() {}

  async transaction(fn: (client: PoolClient) => Promise<void>): Promise<void> {
    const client: PoolClient = await db.connect();

    try {
      await client.query("BEGIN");
      await fn(client);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async query(
    query: string | QueryConfig,
    params?: any[]
  ): Promise<QueryResult> {
    try {
      return await db.query(query, params);
    } catch (error) {
      console.error(`Error executing query: ${query}`, error);
      throw new Error("Database Query Error");
    }
  }

  /**
   * Builds an advanced WHERE clause from the provided filters.
   * Supports complex filters like LIKE, ILIKE, ranges, IN, NOT IN, OR conditions, and nested conditions.
   *
   * @param filters - Object where keys are column names and values are the filter criteria
   * @param indexStart - Optional starting index for parameterized queries (default is 1)
   * @returns { whereClause: string; values: any[] } - The WHERE clause and an array of parameter values
   */
  buildWhereClause(
    filters: Record<string, any>,
    indexStart = 1
  ): { whereClause: string; values: any[] } {
    const conditions: string[] = [];
    const values: any[] = [];
    let index = indexStart;

    // Helper function to process each filter condition
    function processCondition(column: string, filter: any): string {
      if (typeof filter === "object" && filter !== null) {
        // Handle complex conditions like ranges, LIKE, IN, etc.
        if (filter.like) {
          values.push(`%${filter.like}%`);
          return `${column} LIKE $${index++}`;
        } else if (filter.ilike) {
          values.push(`%${filter.ilike}%`);
          return `${column} ILIKE $${index++}`;
        } else if (filter.range) {
          values.push(filter.range[0], filter.range[1]);
          return `${column} BETWEEN $${index++} AND $${index++}`;
        } else if (filter.in) {
          const placeholders = filter.in.map(() => `$${index++}`).join(", ");
          values.push(...filter.in);
          return `${column} IN (${placeholders})`;
        } else if (filter.notIn) {
          const placeholders = filter.notIn.map(() => `$${index++}`).join(", ");
          values.push(...filter.notIn);
          return `${column} NOT IN (${placeholders})`;
        } else if (filter.gte) {
          values.push(filter.gte);
          return `${column} >= $${index++}`;
        } else if (filter.lte) {
          values.push(filter.lte);
          return `${column} <= $${index++}`;
        } else if (filter.neq) {
          values.push(filter.neq);
          return `${column} != $${index++}`;
        }
      } else {
        // Simple equality condition
        values.push(filter);
        return `${column} = $${index++}`;
      }

      return "";
    }

    // Iterate over the filters and process each condition
    for (const [column, filter] of Object.entries(filters)) {
      if (column === "or" && Array.isArray(filter)) {
        // Handle OR conditions with nested filters
        const orConditions = filter
          .map((nestedFilter) => {
            const { whereClause } = this.buildWhereClause(nestedFilter, index);
            index += whereClause.split("$").length - 1; // Update the index
            return `(${whereClause})`;
          })
          .join(" OR ");
        conditions.push(`(${orConditions})`);
      } else {
        const condition = processCondition(column, filter);
        conditions.push(condition);
      }
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return { whereClause, values };
  }

  /**
   * Builds the INSERT clause from the provided entity data.
   */
  buildInsertClause(entity: Partial<T>): {
    columns: string;
    placeholders: string;
    values: any[];
  } {
    const keys = Object.keys(entity);
    const values = Object.values(entity);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

    // Convert keys to snake_case for the column names
    const columns = keys.map((key) => this.toSnakeCase(key)).join(", ");

    return { columns, placeholders, values };
  }

  private toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  /**
   * Builds the UPDATE clause from the provided entity updates.
   */
  buildUpdateClause(updates: Partial<T>): {
    setClause: string;
    values: any[];
  } {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = Object.values(updates);
    return { setClause, values };
  }

  /**
   * Builds the SELECT query with joins
   */
  buildSelectQueryWithJoins(
    tableName: string,
    columns: string[] = ["*"],
    joins: { table: string; on: string }[] = [],
    filters: Record<string, any> = {},
    limit?: number,
    offset?: number,
    orderBy: { column: string; direction: "ASC" | "DESC" } = {
      column: "id",
      direction: "ASC",
    }
  ): { query: string; values: any[] } {
    let query = `SELECT ${columns.join(", ")} FROM ${tableName}`;
    const values: any[] = [];

    if (joins.length > 0) {
      const joinClauses = joins.map(
        (join) => `JOIN ${join.table} ON ${join.on}`
      );
      query += ` ${joinClauses.join(" ")}`;
    }

    if (Object.keys(filters).length > 0) {
      const { whereClause, values: filterValues } =
        this.buildWhereClause(filters);
      query += ` ${whereClause}`;
      values.push(...filterValues);
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy.column} ${orderBy.direction}`;
    }

    if (limit) {
      values.push(limit);
      query += ` LIMIT $${values.length}`;
    }

    if (offset) {
      values.push(offset);
      query += ` OFFSET $${values.length}`;
    }

    return { query, values };
  }
}
