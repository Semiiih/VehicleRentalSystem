import { Link, NavLink } from 'react-router-dom'

export default function ClientNavbar() {
  return (
    <nav className="bg-[#1a1a1a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[#ff5000] font-black text-2xl tracking-tight">VEHICLE</span>
          <span className="text-white font-black text-2xl tracking-tight">RENTAL</span>
        </Link>

        <div className="flex items-center gap-8">
          <NavLink to="/catalog" className={({ isActive }) =>
            `text-sm font-semibold uppercase tracking-wide transition ${isActive ? 'text-[#ff5000]' : 'text-white hover:text-[#ff5000]'}`
          }>
            Véhicules
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
