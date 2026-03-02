import { useEffect, useState } from 'react'

const defaultForm = { vehicleId: '', customerId: '', startDate: '', endDate: '' }

const TYPE_LABELS = { CAR: '🚗 Voiture', BIKE: '🚲 Vélo', TRUCK: '🚛 Camion' }
const TYPE_IMG    = { CAR: '/voiture.png', BIKE: '/moto.png', TRUCK: '/camion.png' }

function vehicleImage(vehicle) {
  if (!vehicle) return null
  return TYPE_IMG[vehicle.type] || '/voiture.png'
}

function daysBetween(start, end) {
  if (!start || !end) return '—'
  const ms = new Date(end) - new Date(start)
  return Math.round(ms / 86400000) + ' j'
}

function RentalModal({ rental, onClose }) {
  if (!rental) return null
  const finished = rental.endDate && new Date(rental.endDate) < new Date(new Date().toDateString())
  const v = rental.vehicle
  const c = rental.customer

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image véhicule */}
        <div className="relative h-52 bg-gray-100 flex items-center justify-center">
          <img
            src={vehicleImage(v)}
            alt={v?.brand}
            className="h-full w-full object-contain p-4"
          />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${finished ? 'bg-gray-200 text-gray-600' : 'bg-green-500 text-white'}`}>
              {finished ? 'Terminée' : 'En cours'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-bold text-lg shadow"
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-5">
          {/* Véhicule */}
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Véhicule</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">{v?.brand}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {TYPE_LABELS[v?.type] || v?.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{v?.basePricePerDay} €/jour</p>
          </div>

          {/* Client */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-400 uppercase font-medium mb-2">Client</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {c?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{c?.name}</p>
                <p className="text-xs text-gray-500">{c?.email} · {c?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Dates & prix */}
          <div className="border-t pt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Début</p>
              <p className="font-semibold text-gray-700 text-sm">{rental.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Durée</p>
              <p className="font-semibold text-gray-700 text-sm">{daysBetween(rental.startDate, rental.endDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Fin</p>
              <p className="font-semibold text-gray-700 text-sm">{rental.endDate}</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-green-700 font-medium">Total location</span>
            <span className="text-2xl font-bold text-green-700">{rental.totalPrice} €</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RentalsPage() {
  const [rentals, setRentals]     = useState([])
  const [vehicles, setVehicles]   = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm]           = useState(defaultForm)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [selected, setSelected]   = useState(null)

  const fetchAll = async () => {
    const [r, v, c] = await Promise.all([
      fetch('/api/rentals').then((res) => res.json()),
      fetch('/api/vehicles').then((res) => res.json()),
      fetch('/api/customers').then((res) => res.json()),
    ])
    setRentals(Array.isArray(r) ? r : [])
    setVehicles(Array.isArray(v) ? v : [])
    setCustomers(Array.isArray(c) ? c : [])
  }

  useEffect(() => { fetchAll() }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `/api/vehicles/${form.vehicleId}/rent?customerId=${form.customerId}&startDate=${form.startDate}&endDate=${form.endDate}`,
        { method: 'POST' }
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message || `Erreur ${res.status}`)
      }
      setForm(defaultForm)
      fetchAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const vehicleLabel = (v) => `#${v.id} – ${v.brand} (${v.type})`
  const customerLabel = (c) => `#${c.id} – ${c.name}`
  const isFinished = (endDate) => endDate && new Date(endDate) < new Date(new Date().toDateString())

  const getDays = () => {
    if (!form.startDate || !form.endDate) return 0
    const diff = (new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }

  const previewPrice = () => {
    if (!form.vehicleId || !form.startDate || !form.endDate) return null
    const v = vehicles.find((v) => v.id === parseInt(form.vehicleId))
    if (!v) return null
    const days = getDays()
    if (days <= 0) return null
    let price = v.basePricePerDay * days
    if (v.type === 'BIKE') price *= 0.9
    if (v.type === 'TRUCK') price += 50
    return price.toFixed(2)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Locations</h1>

      {/* Modal */}
      <RentalModal rental={selected} onClose={() => setSelected(null)} />

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Créer une location</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Véhicule</label>
            <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">-- Choisir un véhicule --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{vehicleLabel(v)} — {v.basePricePerDay} €/j</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Client</label>
            <select name="customerId" value={form.customerId} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">-- Choisir un client --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{customerLabel(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date de début</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date de fin</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required
              min={form.startDate || undefined}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          {previewPrice() && (
            <div className="col-span-2">
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 inline-flex items-center gap-3">
                <div>
                  <p className="text-xs text-green-600 font-medium">Prix estimé ({getDays()} jours)</p>
                  <p className="text-2xl font-bold text-green-700">{previewPrice()} €</p>
                </div>
              </div>
            </div>
          )}
          <div className="col-span-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? 'Création...' : 'Créer la location'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Véhicule</th>
              <th className="px-4 py-3 text-left">Début</th>
              <th className="px-4 py-3 text-left">Fin</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rentals.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Aucune location</td></tr>
            )}
            {rentals.map((r) => {
              const finished = isFinished(r.endDate)
              return (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`cursor-pointer transition ${finished ? 'bg-gray-50 opacity-50' : 'hover:bg-blue-50'}`}
                >
                  <td className="px-4 py-3 text-gray-500">#{r.id}</td>
                  <td className="px-4 py-3 font-medium">{r.customer?.name}</td>
                  <td className="px-4 py-3">{r.vehicle?.brand}</td>
                  <td className="px-4 py-3">{r.startDate}</td>
                  <td className="px-4 py-3">{r.endDate}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{r.totalPrice} €</td>
                  <td className="px-4 py-3">
                    {finished
                      ? <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full">Terminée</span>
                      : <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">En cours</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 text-center py-2">Cliquer sur une ligne pour voir les détails</p>
      </div>
    </div>
  )
}
