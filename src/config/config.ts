import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
    //@ts-ignore
    dbPort: parseInt(process.env.DB_PORT, 10),
  jwtSecret: process.env.JWT_SECRET || "",
};
