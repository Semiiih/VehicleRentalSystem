import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import VehiclesPage from './pages/VehiclesPage'
import CustomersPage from './pages/CustomersPage'
import RentalsPage from './pages/RentalsPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-700 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-8">
            <span className="font-bold text-xl tracking-wide">🚗 VehicleRental</span>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1 rounded font-medium transition ${isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Véhicules
            </NavLink>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `px-3 py-1 rounded font-medium transition ${isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Clients
            </NavLink>
            <NavLink
              to="/rentals"
              className={({ isActive }) =>
                `px-3 py-1 rounded font-medium transition ${isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Locations
            </NavLink>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<VehiclesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/rentals" element={<RentalsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
