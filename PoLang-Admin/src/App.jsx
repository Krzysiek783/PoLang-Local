import AdminLayout from './components/AdminLayout';
import AdminGuard from './components/AdminGuard';


export default function App() {
  return (
    <AdminGuard>
      <AdminLayout />

    <div>
      <main className="p-4">
        <h2 className="text-2xl">Witaj w panelu PoLang!</h2>
      </main>
    </div>
    </AdminGuard>

  );
}
