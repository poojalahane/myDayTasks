// Imports
import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, prettyPrint, cli, colorize, simple } = format;

export function createEntityLogger(entityName: string) {
  return createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
      timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
      json(),
      prettyPrint()
    ),
    transports: [
      new transports.File({
        dirname: `./src/logs/${entityName}`,
        filename: `${entityName}.log`,
      }),
      new transports.File({
        dirname: `./src/logs/${entityName}`,
        filename: `${entityName}.errors.log`,
        level: "error",
        format: combine(
          timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
          format.errors({ stack: true }),
          json(),
          prettyPrint()
        ),
      }),
      new transports.Console({
        format: combine(cli(), colorize(), simple()),
      }),
    ],
  });
}
