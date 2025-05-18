import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;


export default function JsonImportForm() {
  const [level, setLevel] = useState("A1");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Wybierz plik JSON");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const words = JSON.parse(reader.result);
        setLoading(true);
        await axios.post(`${BASE_URL}/api/words/bulk/${level}`, words);
        setSuccess(true);
      } catch (err) {
        console.error(err);
        alert("Błąd podczas importu");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mt-8">
      <h3 className="text-xl font-bold mb-4">📦 Import słówek z pliku JSON</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
            <option key={lvl}>{lvl}</option>
          ))}
        </select>

        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Importuję..." : "Importuj słówka"}
        </button>

        {success && <p className="text-green-600 font-semibold">✅ Import zakończony!</p>}
      </form>
    </div>
  );
}
