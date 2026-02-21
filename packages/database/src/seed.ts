import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import bcrypt from "bcryptjs"
import { users } from "./schemas/users"
import { channels } from "./schemas/channels"

async function seed() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    })

    await client.connect()
    const db = drizzle(client)

    console.log("🌱 Seeding...")

    await db.delete(users)
    console.log("✅ Users deleted")
    await db.delete(channels)
    console.log("✅ Channels deleted")

    await db.insert(users).values([
        {
            name: "reda",
            email: "reda@example.com",
            hashedPassword: await bcrypt.hash("password", 12),
            role: "admin",
        },
        {
            name: "ahmed",
            email: "ahmed@example.com",
            hashedPassword: await bcrypt.hash("password", 12),
        },
        {
            name: "omar",
            email: "omar@example.com",
            hashedPassword: await bcrypt.hash("password", 12),
        },
    ])

    console.log("✅ Done")
    await client.end()
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err)
    process.exit(1)
})
