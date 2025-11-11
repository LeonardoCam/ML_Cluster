import pool from "./database.js";
import pgvector from "pgvector/pg";
import { getFilePaths } from "./utils.js";
import { visionEmbeddingGenerator } from "./model.js";
import dotenv from "dotenv";
dotenv.config();

// folder dataset: en docker-compose se monta ./backend/dataset -> /app/dataset
const folder = "./dataset";

async function main() {
  const client = await pool.connect();
  try {

    // crear extensión vector si no existe
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // crear tabla si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS Search_table (
        id BIGSERIAL PRIMARY KEY,
        path TEXT,
        embedding vector(512)
      );
    `);
    

    const files = getFilePaths(folder);
    console.log("Found files:", files.length);

    for (const f of files) {
      console.log("Procesando:", f);
      const emb = await visionEmbeddingGenerator(f); // emb es TypedArray
      await client.query(
        `INSERT INTO Search_table (path, embedding) VALUES ($1, $2)`,
        [f, pgvector.toSql(Array.from(emb))]
      );
      console.log("Insertado", f);
    }

    // crear índice ivfflat (opcional, más rápido para grandes volúmenes)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_search_embedding ON Search_table USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`);

    console.log("Inserción completada");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

main();
