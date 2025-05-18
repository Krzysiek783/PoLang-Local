import { useState } from "react";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL;

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function LessonForm() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("A1");
  const [vocabulary, setVocabulary] = useState([
    { word: "", translation: "", image: null, audio: null },
  ]);

  const handleAddWord = () => {
    setVocabulary([
      ...vocabulary,
      { word: "", translation: "", image: null, audio: null },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...vocabulary];
    updated[index][field] = value;
    setVocabulary(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const lessonData = {
      title,
      level,
      activities: {
        vocabulary: vocabulary.map((item) => ({
          word: item.word,
          translation: item.translation,
          image: item.image?.name,
          audio: item.audio?.name,
        })),
      },
    };

    formData.append("lessonData", JSON.stringify(lessonData));
    vocabulary.forEach((item) => {
      if (item.image) formData.append("files", item.image);
      if (item.audio) formData.append("files", item.audio);
    });

    try {
        await axios.post(`${BASE_URL}/api/lessons`, formData);
        alert("Lekcja dodana!");
    } catch (err) {
      console.error(err);
      alert("Błąd przy dodawaniu lekcji.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dodaj nową lekcję</h2>

      <input
        type="text"
        className="w-full border p-2 mb-2"
        placeholder="Tytuł lekcji"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        className="w-full border p-2 mb-4"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        {levels.map((lvl) => (
          <option key={lvl} value={lvl}>
            {lvl}
          </option>
        ))}
      </select>

      <h3 className="text-xl font-semibold mb-2">Słówka</h3>

      {vocabulary.map((item, index) => (
        <div key={index} className="mb-4 border p-2 rounded">
          <input
            type="text"
            placeholder="Słówko"
            className="w-full border p-1 mb-1"
            value={item.word}
            onChange={(e) => handleChange(index, "word", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tłumaczenie"
            className="w-full border p-1 mb-1"
            value={item.translation}
            onChange={(e) =>
              handleChange(index, "translation", e.target.value)
            }
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(index, "image", e.target.files[0])}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleChange(index, "audio", e.target.files[0])}
          />
        </div>
      ))}

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAddWord}
      >
        + Dodaj słówko
      </button>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Zapisz lekcję
      </button>
    </form>
  );
}
