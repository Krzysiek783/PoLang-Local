import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;


export default function WordManager() {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [level, setLevel] = useState("A1");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("word", word);
    formData.append("translation", translation);
    if (image) formData.append("image", image);
    if (audio) formData.append("audio", audio);

    try {
      await axios.post(`${BASE_URL}/api/words/${level}`, formData);
      setSuccess(true);
      setWord("");
      setTranslation("");
      setImage(null);
      setAudio(null);
    } catch (err) {
      console.error(err);
      alert("❌ Błąd podczas zapisywania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Dodaj nowe słówko</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Słówko"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Tłumaczenie"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
            <option key={lvl}>{lvl}</option>
          ))}
        </select>
        <div>
          <label className="block mb-1 font-medium">Obrazek:</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Audio:</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Zapisuję..." : "Zapisz słówko"}
        </button>
        {success && (
          <div className="text-green-600 font-semibold">✅ Słówko zapisane!</div>
        )}
      </form>
    </div>
  );
}
