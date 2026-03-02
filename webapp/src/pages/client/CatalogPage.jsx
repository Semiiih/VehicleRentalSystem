import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TYPE_LABELS = { CAR: 'Voiture', BIKE: 'Vélo', TRUCK: 'Camion' }
const TYPE_ICONS = { CAR: '🚗', BIKE: '🚲', TRUCK: '🚛' }

export default function CatalogPage() {
  const [vehicles, setVehicles] = useState([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetch('/api/vehicles')
      .then((r) => r.ok ? r.json() : [])
      .then(setVehicles)
      .catch(() => setVehicles([]))
  }, [])

  const filtered = filter === 'ALL' ? vehicles : vehicles.filter((v) => v.type === filter)

  return (
    <div className="bg-[#f4f5f6] min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-[#1a1a1a]">Nos véhicules</h1>
        <p className="text-gray-500 mt-2 mb-8">Trouvez le véhicule idéal pour votre prochaine aventure</p>

        {/* Filtres */}
        <div className="flex gap-3 mb-10">
          {[['ALL', 'Tous'], ['CAR', '🚗 Voitures'], ['BIKE', '🚲 Vélos'], ['TRUCK', '🚛 Camions']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${
                filter === key
                  ? 'bg-[#ff5000] text-white'
                  : 'bg-white text-[#1a1a1a] hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <div key={v.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="bg-[#1a1a1a] h-48 flex items-center justify-center">
                <span className="text-8xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition">{TYPE_ICONS[v.type] || '🚗'}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#ff5000]">{TYPE_LABELS[v.type]}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">{v.brand}</h3>
                <div className="mt-1 text-sm text-gray-500">
                  {v.type === 'CAR' && `${v.numberOfDoors} portes`}
                  {v.type === 'BIKE' && (v.electric ? 'Électrique' : 'Non électrique')}
                  {v.type === 'TRUCK' && `Charge : ${v.loadCapacity} kg`}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-black text-[#1a1a1a]">{v.basePricePerDay}€</span>
                    <span className="text-sm text-gray-400 ml-1">/jour</span>
                  </div>
                  <Link to={`/book/${v.id}`} className="bg-[#ff5000] text-white text-sm font-bold px-5 py-2.5 rounded hover:bg-[#e04800] transition">
                    Réserver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-20 text-lg">Aucun véhicule disponible</p>
        )}
      </div>
    </div>
  )
}
