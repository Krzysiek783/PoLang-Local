import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;


export default function ListeningLessonForm() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("A1");
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [uploading, setUploading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const uploadAudio = async () => {
    if (!audioFile) return "";

    const formData = new FormData();
    formData.append("file", audioFile);

    const res = await fetch(`${BASE_URL}/api/upload/audio`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.audioUrl;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);   // 🟦 MP3
      formData.append("json", jsonFile);     // 📄 JSON
      formData.append("level", level);       // 🔠 poziom (A1 itd.)

      const res = await fetch(`${BASE_URL}/api/listening/upload`, {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert("✅ Lekcja dodana!");
        console.log("🎯 ID lekcji:", result.id);
      } else {
        console.error("❌ Błąd:", result.error);
        alert("❌ Nie udało się dodać lekcji.");
      }
    } catch (err) {
      console.error("❌ Błąd sieci:", err);
      alert("❌ Błąd sieci");
    }
  
    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-4 space-y-6 bg-white shadow rounded-md"
    >
      <h2 className="text-2xl font-bold">🎧 Dodaj lekcję słuchania</h2>

      <input
        className="w-full p-2 border border-gray-300 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tytuł lekcji"
        required={title.length === 0}

      />

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
          <option key={lvl}>{lvl}</option>
        ))}
      </select>

      <textarea
        rows={5}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Transkrypcja (1 linia = 1 zdanie)"
        className="w-full p-2 border border-gray-300 rounded"
        required={transcript.length === 0}

      />

      <textarea
        rows={5}
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        placeholder="Tłumaczenie (1 linia = 1 zdanie)"
        className="w-full p-2 border border-gray-300 rounded"
        required={translation.length === 0}

      />

              
    <label className="block font-medium">🎵 Plik audio (MP3)</label>
      <input
        type="file"
        accept=".mp3"
        onChange={(e) => setAudioFile(e.target.files[0])}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

    <label className="block font-medium">📄 Plik JSON z pytaniami</label>
      <input
        type="file"
        accept="application/json"
        onChange={async (e) => {
            const file = e.target.files[0];
            setJsonFile(file);
        
            if (!file) return;
        
            const text = await file.text();
            const parsed = JSON.parse(text);
        
            if (parsed.title) setTitle(parsed.title);
            if (parsed.transcript) setTranscript(parsed.transcript.join('\n'));
            if (parsed.translation) setTranslation(parsed.translation.join('\n'));
            if (parsed.questions) setQuestions(parsed.questions);
            
            console.log('✅ Dane JSON załadowane do formularza');
          }}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <h3 className="text-lg font-semibold">❓ Pytania</h3>
      {questions.map((q, i) => (
        <div
          key={i}
          className="border border-gray-200 p-4 rounded mb-4 space-y-2 bg-gray-50"
        >
          <input
            type="text"
            placeholder="Pytanie"
            value={q.question}
            onChange={(e) => handleChange(i, "question", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required={questions.length === 0}

          />

          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, j) => (
              <input
                key={j}
                type="text"
                placeholder={`Opcja ${j + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, j, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required={opt.length === 0}

              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Poprawna odpowiedź"
            value={q.correctAnswer}
            onChange={(e) => handleChange(i, "correctAnswer", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required={q.correctAnswer.length === 0}

          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddQuestion}
        className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        + Dodaj pytanie
      </button>

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        {uploading ? "Wysyłanie..." : "💾 Zapisz lekcję"}
      </button>
    </form>
  );
}
