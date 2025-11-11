import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST || "db",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "Nseguridad",
  database: process.env.PGDATABASE || "image_search",
  port: process.env.PGPORT || 5432,
});

export default pool;
