import React, { useState } from "react";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);

  const textSearch = async () => {
    const res = await axios.post("http://localhost:3000/search/text", { query });
    setResults(res.data);
  };

  const imageSearch = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const res = await axios.post("http://localhost:3000/search/image", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setResults(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>CLIP Image Search</h2>

      <div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="texto..." />
        <button onClick={textSearch}>Buscar por texto</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={imageSearch}>Buscar por imagen</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Resultados</h3>
        {results.map((r, i) => (
          <div key={i}>
            <p>{r.path}</p>
            {/* si quieres mostrar imagenes desde el host, debes servirlas por HTTP o montar volumen */}
          </div>
        ))}
      </div>
    </div>
  );
}
