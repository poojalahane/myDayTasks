// Imports
import config from "config";

// ----------------------------------------------
//  Environment Variables
// ----------------------------------------------
export const PORT = config.get("express.PORT");

// ----------------------------------------------
//  Database
// ----------------------------------------------\
export const POSTGRES_USER = config.get("db.POSTGRES_USER");
export const POSTGRES_HOST = config.get("db.POSTGRES_HOST");
export const POSTGRES_DATABASE = config.get("db.POSTGRES_DATABASE");
export const POSTGRES_PASSWORD = config.get("db.POSTGRES_PASSWORD");
export const POSTGRES_PORT = config.get("db.POSTGRES_PORT");
export const POSTGRES_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`;

// ----------------------------------------------
//  JWT
// ----------------------------------------------
export const JWT_SECRET = config.get("jwt.JWT_SECRET");
export const JWT_EXPIRES_IN = config.get("jwt.JWT_EXPIRES_IN");

// ----------------------------------------------
//  Redis
// ----------------------------------------------
export const REDIS_HOST = config.get("redis.REDIS_HOST");
export const REDIS_PORT = config.get("redis.REDIS_PORT");
export const REDIS_PASSWORD = config.get("redis.REDIS_PASSWORD");

// ----------------------------------------------
//  SQL
// ----------------------------------------------
export const SQL_NULL = "NULL";
