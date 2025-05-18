import { useState } from 'react';

export default function LoginModal({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error('Unauthorized');
      }

      onSuccess();
    } catch (err) {
      setError('❌ Nieprawidłowe hasło');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded shadow-md w-80 text-black">
    <h2 className="text-lg font-semibold mb-4">🔐 Logowanie do panelu admina</h2>
    <input
      type="password"
      placeholder="Hasło"
      className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black placeholder-gray-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleLogin();
        }
      }}
    />
    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
    <button
      onClick={handleLogin}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
    >
      Zaloguj się
    </button>
  </div>
</div>

  );
}
