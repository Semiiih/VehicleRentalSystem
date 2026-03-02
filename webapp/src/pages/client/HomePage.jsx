import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TYPE_LABELS = { CAR: 'Voiture', BIKE: 'Vélo', TRUCK: 'Camion' }
const TYPE_ICONS = { CAR: '🚗', BIKE: '🚲', TRUCK: '🚛' }

export default function HomePage() {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    fetch('/api/vehicles')
      .then((r) => r.ok ? r.json() : [])
      .then(setVehicles)
      .catch(() => setVehicles([]))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')] bg-cover bg-center opacity-40" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 md:py-44">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Louez le véhicule<br />
            <span className="text-[#ff5000]">de vos rêves.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Des voitures, vélos et camions disponibles à la location. Réservez en quelques clics aux meilleurs prix.
          </p>
          <div className="mt-10">
            <Link to="/catalog" className="bg-[#ff5000] text-white font-bold text-lg px-8 py-4 rounded hover:bg-[#e04800] transition">
              Voir nos véhicules
            </Link>
          </div>
        </div>
      </section>

      {/* Véhicules populaires */}
      <section className="bg-[#f4f5f6] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-[#1a1a1a] mb-2">Nos véhicules</h2>
          <p className="text-gray-500 mb-10">Choisissez parmi notre flotte de véhicules disponibles</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 6).map((v) => (
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

          {vehicles.length > 6 && (
            <div className="mt-10 text-center">
              <Link to="/catalog" className="text-[#ff5000] font-bold text-lg hover:underline">
                Voir tous les véhicules →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
