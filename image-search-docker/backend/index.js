import express from "express";
import cors from "cors";
import multer from "multer";
import pool from "./database.js";
import pgvector from "pgvector/pg";
import { textEmbeddingGenerator, visionEmbeddingGenerator } from "./model.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ping
app.get("/", (_, res) => res.send("Image Search API running"));

// search by text
app.post("/search/text", async (req, res) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  const client = await pool.connect();
  try {
    const emb = await textEmbeddingGenerator(query);
    const sqlEmb = pgvector.toSql(Array.from(emb));
    const { rows } = await client.query(`SELECT path FROM Search_table ORDER BY embedding <-> $1 LIMIT 10`, [sqlEmb]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "search error" });
  } finally {
    client.release();
  }
});

// search by image (upload)
app.post("/search/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "image required" });

  const imagePath = req.file.path;
  const client = await pool.connect();
  try {
    const emb = await visionEmbeddingGenerator(imagePath);
    const sqlEmb = pgvector.toSql(Array.from(emb));
    const { rows } = await client.query(`SELECT path FROM Search_table ORDER BY embedding <-> $1 LIMIT 10`, [sqlEmb]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "search image error" });
  } finally {
    client.release();
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
