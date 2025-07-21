// Imports 
import { Pool } from "pg";

// Local Imports
import { POSTGRES_URL } from "../constants";


declare global {
  var db: Pool | undefined;
}

export const db = globalThis.db || new Pool({ connectionString: POSTGRES_URL });

if (process.env.NODE_ENV !== "production") globalThis.db = db;

