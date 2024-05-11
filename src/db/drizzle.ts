import "dotenv/config";

import * as schema from "./schema";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema, logger: true });

export default db;
