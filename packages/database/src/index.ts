import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schemas"
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

const db = drizzle(pool, {
    schema,
})

export default db
