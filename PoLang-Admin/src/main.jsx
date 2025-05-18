import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import WordManager from "./pages/WordManager";
import LessonForm from "./pages/LessonForm";
import JsonImportForm from "./pages/JsonImportForm";
import RecordingForm from "./pages/RecordingForm";
import FillBlankForm from "./pages/FillBlankForm";
import AdminGuard from './components/AdminGuard';


import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminGuard>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<div className="text-xl">👋 Witaj w panelu PoLang!</div>} />
          <Route path="words" element={<WordManager />} />
          <Route path="lessons" element={<LessonForm />} />
          <Route path="import" element={<JsonImportForm />} />
          <Route path="recordings" element={<RecordingForm />} />
          <Route path="fillBlank" element={<FillBlankForm />} />

        </Route>
      </Routes>
      </BrowserRouter>
    </AdminGuard>
  </React.StrictMode>
);
