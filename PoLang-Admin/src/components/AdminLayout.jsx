import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 transition ${
      isActive ? "bg-blue-500 text-white" : "text-gray-700"
    }`;

  return (
<div className="min-h-screen flex bg-white text-black">
{/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 font-bold text-2xl text-blue-600">PoLang Admin</div>
        <nav className="px-4 space-y-1">
          <NavLink to="/lessons" className={linkClass}>Lekcje</NavLink>
          <NavLink to="/words" className={linkClass}>Słówka</NavLink>
          <NavLink to="/import" className={linkClass}>Import JSON</NavLink>
          <NavLink to="/recordings" className={linkClass}>Import Nagrań</NavLink>
          <NavLink to="/fillBlank" className={linkClass}>Import gramatyczne Fill-Blank</NavLink>

        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
