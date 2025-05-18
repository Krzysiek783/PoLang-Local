import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function FillBlankForm() {
  const [level, setLevel] = useState("A1");
  const [sentence, setSentence] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [jsonFile, setJsonFile] = useState(null);
  const [parsedJson, setParsedJson] = useState(null);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    setJsonFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setParsedJson(parsed);
        alert("✅ Plik JSON załadowany — kliknij 'Zapisz zadania' by dodać.");
      } catch (err) {
        alert("❌ Niepoprawny plik JSON");
      }
    };
    reader.readAsText(file);
  };

  const sendBulkQuestions = async (questions) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/grammar/fill/bulk/${level}`, questions);
      alert(`✅ Dodano ${res.data.added} zadań\n❗ Pominięto ${res.data.skipped || 0}`);
      setParsedJson(null);
    } catch (err) {
      console.error(err);
      alert("❌ Błąd podczas importu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sentence || !correctAnswer || options.some((opt) => !opt)) {
      return alert("⚠️ Uzupełnij wszystkie pola");
    }

    try {
      const payload = { sentence, options, correctAnswer };
      await axios.post(`${BASE_URL}/api/grammar/fill/${level}`, payload);
      alert("✅ Zadanie zapisane!");
      setSentence("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (err) {
      console.error(err);
      alert("❌ Błąd przy zapisie");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">✍️ Dodaj zadanie: Uzupełnianie luk</h2>

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
          type="text"
          placeholder="Zdanie z luką (np. She ___ home.)"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Opcja ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="w-full border p-2 rounded"
          />
        ))}

        <input
          type="text"
          placeholder="Poprawna odpowiedź (musi być jedna z opcji)"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 block w-full"
        >
          Zapisz zadanie
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">📄 Import z JSON-a</h3>
        <input
          type="file"
          accept=".json"
          onChange={handleJsonUpload}
          className="w-full"
        />

        {parsedJson && (
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 block w-full"
            onClick={() => sendBulkQuestions(parsedJson)}
          >
            📤 Zapisz zadania z pliku JSON
          </button>
        )}
      </div>
    </div>
  );
}
