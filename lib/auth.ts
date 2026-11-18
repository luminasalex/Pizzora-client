import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("Pizzora")

// All roles in the project
export const ROLES = ["customer", "vendor", "admin"] as const
export type Role = (typeof ROLES)[number]

// Roles a person can pick on the sign-up page ("admin" is NOT allowed here)
const SIGNUP_ROLES = ["customer", "vendor"]

// Optional: comma separated list in .env, e.g.
// ADMIN_EMAILS=owner@gmail.com,boss@gmail.com
// Only works when the email is VERIFIED (for example Google sign-in).
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      // "customer" | "vendor" | "admin"
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true, // allow the client to send it at sign-up (sanitized below)
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Never trust the client: sign-up can only create customer / vendor.
          let role: Role = SIGNUP_ROLES.includes(user.role as string)
            ? (user.role as Role)
            : "customer"

          // Admin only for listed emails that are verified
          if (
            user.emailVerified &&
            ADMIN_EMAILS.includes(user.email.toLowerCase())
          ) {
            role = "admin"
          }

          return { data: { ...user, role } }
        },
      },
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
})

export type Auth = typeof auth