import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TYPE_LABELS = { CAR: 'Voiture', BIKE: 'Vélo', TRUCK: 'Camion' }
const TYPE_ICONS = { CAR: '🚗', BIKE: '🚲', TRUCK: '🚛' }

export default function BookingPage() {
  const { id } = useParams()
  const { customer } = useAuth()
  const navigate = useNavigate()

  const [vehicle, setVehicle] = useState(null)
  const [rentals, setRentals] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!customer) return
    fetch('/api/vehicles')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setVehicle(data.find((v) => v.id === parseInt(id)) || null))
      .catch(() => setVehicle(null))

    fetch(`/api/rentals/vehicle/${id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setRentals)
      .catch(() => setRentals([]))
  }, [id, customer])

  if (!customer) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#f4f5f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-black text-[#1a1a1a] mb-2">Connexion requise</h2>
          <p className="text-gray-500 mb-8">Vous devez être connecté pour réserver un véhicule</p>
          <Link to="/login" className="bg-[#ff5000] text-white font-bold px-8 py-3.5 rounded-lg hover:bg-[#e04800] transition">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#f4f5f6] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Chargement...</p>
      </div>
    )
  }

  const getDays = () => {
    if (!startDate || !endDate) return 0
    const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }

  const getPrice = () => {
    const days = getDays()
    if (days <= 0) return null
    let price = vehicle.basePricePerDay * days
    if (vehicle.type === 'BIKE') price *= 0.9
    if (vehicle.type === 'TRUCK') price += 50
    return price.toFixed(2)
  }

  const isBooked = (dateStr) =>
    rentals.some((r) => dateStr >= r.startDate && dateStr <= r.endDate)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(
        `/api/vehicles/${id}/rent?customerId=${customer.id}&startDate=${startDate}&endDate=${endDate}`,
        { method: 'POST' }
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message || `Erreur ${res.status}`)
      }
      setSuccess('Réservation confirmée ! Vous pouvez retrouver vos locations dans votre espace.')
      setStartDate('')
      setEndDate('')
      // Refresh rentals
      const updated = await fetch(`/api/rentals/vehicle/${id}`)
      if (updated.ok) setRentals(await updated.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Mini calendar
  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const DAYS_LABELS = ['Lu','Ma','Me','Je','Ve','Sa','Di']

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const startOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const toDateStr = (d) => `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }

  return (
    <div className="bg-[#f4f5f6] min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/catalog" className="text-[#ff5000] font-semibold text-sm hover:underline mb-6 inline-block">← Retour au catalogue</Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Véhicule info */}
          <div>
            <div className="bg-[#1a1a1a] rounded-xl h-64 flex items-center justify-center mb-6">
              <span className="text-9xl opacity-70">{TYPE_ICONS[vehicle.type] || '🚗'}</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-[#ff5000]">{TYPE_LABELS[vehicle.type]}</span>
            <h1 className="text-3xl font-black text-[#1a1a1a] mt-1">{vehicle.brand}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {vehicle.type === 'CAR' && `${vehicle.numberOfDoors} portes`}
              {vehicle.type === 'BIKE' && (vehicle.electric ? 'Électrique' : 'Non électrique')}
              {vehicle.type === 'TRUCK' && `Charge : ${vehicle.loadCapacity} kg`}
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-[#1a1a1a]">{vehicle.basePricePerDay}€</span>
              <span className="text-gray-400 ml-1">/jour</span>
            </div>

            {/* Calendrier */}
            <div className="bg-white rounded-xl p-5 mt-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium">←</button>
                <span className="font-bold text-[#1a1a1a]">{MONTHS[calMonth]} {calYear}</span>
                <button onClick={nextMonth} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium">→</button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS_LABELS.map((d) => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />
                  const dateStr = toDateStr(day)
                  const booked = isBooked(dateStr)
                  const isToday = dateStr === todayStr
                  return (
                    <div key={dateStr} className={`text-center py-1.5 rounded text-xs font-medium ${booked ? 'bg-red-500 text-white' : 'bg-green-50 text-green-700'} ${isToday ? 'ring-2 ring-[#ff5000]' : ''}`}>
                      {day}
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-50 border border-green-200" /> Disponible</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Loué</span>
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8 sticky top-24">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-6">Réserver ce véhicule</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">{success}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Date de prise en charge</label>
                  <input
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
                    min={todayStr}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Date de retour</label>
                  <input
                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required
                    min={startDate || todayStr}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] transition"
                  />
                </div>

                {getPrice() && (
                  <div className="bg-[#f4f5f6] rounded-lg p-5">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>{vehicle.basePricePerDay}€ x {getDays()} jours</span>
                      <span>{(vehicle.basePricePerDay * getDays()).toFixed(2)}€</span>
                    </div>
                    {vehicle.type === 'BIKE' && (
                      <div className="flex justify-between text-sm text-green-600 mb-2">
                        <span>Réduction vélo (-10%)</span>
                        <span>-{(vehicle.basePricePerDay * getDays() * 0.1).toFixed(2)}€</span>
                      </div>
                    )}
                    {vehicle.type === 'TRUCK' && (
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Supplément camion</span>
                        <span>+50.00€</span>
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3 flex justify-between">
                      <span className="font-black text-[#1a1a1a]">Total</span>
                      <span className="text-2xl font-black text-[#ff5000]">{getPrice()}€</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit" disabled={loading || !getPrice()}
                  className="w-full bg-[#ff5000] text-white font-bold py-4 rounded-lg hover:bg-[#e04800] disabled:opacity-50 transition"
                >
                  {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
