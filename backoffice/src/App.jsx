import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import VehiclesPage from "./pages/VehiclesPage";
import CustomersPage from "./pages/CustomersPage";
import RentalsPage from "./pages/RentalsPage";
import CalendarPage from "./pages/CalendarPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#141414] h-[60px] flex items-stretch">
        <div className="max-w-[1300px] w-full mx-auto px-8 flex items-stretch">
          <div
            className="flex items-center px-6 pr-8 mr-9 flex-shrink-0 bg-[#FF5F00]"
            style={{
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
            }}
          >
            <span className="text-white font-black text-lg tracking-tight uppercase">
              VehicleRental
            </span>
          </div>

          {/* Liens */}
          <div className="flex items-stretch gap-0">
            {[
              { to: "/", label: "Véhicules", end: true },
              { to: "/customers", label: "Clients" },
              { to: "/rentals", label: "Locations" },
              { to: "/calendar", label: "Calendrier" },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center px-5 text-[11px] font-bold tracking-widest uppercase transition-colors border-b-[3px] ${
                    isActive
                      ? "text-white border-[#FF5F00]"
                      : "text-white/40 border-transparent hover:text-white/75"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Badge admin */}
          <div className="ml-auto flex items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#FF5F00] border border-[#FF5F00]/40 px-3 py-1 rounded-sm">
              Administration
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-[60px] min-h-screen bg-[#F2F2F2]">
        <Routes>
          <Route path="/" element={<VehiclesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
