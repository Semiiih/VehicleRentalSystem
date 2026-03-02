import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ClientNavbar from './components/ClientNavbar'
import HomePage from './pages/client/HomePage'
import CatalogPage from './pages/client/CatalogPage'
import BookingPage from './pages/client/BookingPage'
import VehiclesPage from './pages/VehiclesPage'
import CustomersPage from './pages/CustomersPage'
import RentalsPage from './pages/RentalsPage'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-8">
          <span className="font-bold text-xl tracking-wide">🔧 Admin</span>
          <NavLink to="/admin" end className={({ isActive }) => `px-3 py-1 rounded font-medium transition ${isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'}`}>
            Véhicules
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => `px-3 py-1 rounded font-medium transition ${isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'}`}>
            Clients
          </NavLink>
          <NavLink to="/admin/rentals" className={({ isActive }) => `px-3 py-1 rounded font-medium transition ${isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'}`}>
            Locations
          </NavLink>
          <NavLink to="/" className="ml-auto text-sm opacity-70 hover:opacity-100 transition">
            ← Portail client
          </NavLink>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route index element={<VehiclesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="rentals" element={<RentalsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function ClientLayout() {
  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <ClientNavbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="book/:id" element={<BookingPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/*" element={<ClientLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
