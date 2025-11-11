import fs from "fs";
import path from "path";

export function getFilePaths(directory) {
  try {
    const files = fs.readdirSync(directory);
    return files.map(f => path.join(directory, f)).filter(p => /\.(jpg|jpeg|png)$/i.test(p));
  } catch (err) {
    console.error("Error leyendo directorio:", err);
    return [];
  }
}
