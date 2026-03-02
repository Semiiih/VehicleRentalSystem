import { useEffect, useState } from 'react'

const defaultForm = { vehicleId: '', customerId: '', days: '' }

export default function RentalsPage() {
  const [rentals, setRentals] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = async () => {
    const [r, v, c] = await Promise.all([
      fetch('/api/rentals').then((res) => res.json()),
      fetch('/api/vehicles').then((res) => res.json()),
      fetch('/api/customers').then((res) => res.json()),
    ])
    setRentals(r)
    setVehicles(v)
    setCustomers(c)
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
        `/api/vehicles/${form.vehicleId}/rent?days=${form.days}&customerId=${form.customerId}`,
        { method: 'POST' }
      )
      if (!res.ok) throw new Error(await res.text())
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

  const previewPrice = () => {
    if (!form.vehicleId || !form.days) return null
    const v = vehicles.find((v) => v.id === parseInt(form.vehicleId))
    if (!v) return null
    const days = parseInt(form.days)
    let price = v.basePricePerDay * days
    if (v.type === 'BIKE') price *= 0.9
    if (v.type === 'TRUCK') price += 50
    return price.toFixed(2)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Locations</h1>

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
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de jours</label>
            <input name="days" type="number" min="1" value={form.days} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ex: 5" />
          </div>
          {previewPrice() && (
            <div className="flex items-end">
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 w-full">
                <p className="text-xs text-green-600 font-medium">Prix estimé</p>
                <p className="text-2xl font-bold text-green-700">{previewPrice()} €</p>
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
                <tr key={r.id} className={finished ? 'bg-gray-50 opacity-50' : 'hover:bg-gray-50'}>
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
      </div>
    </div>
  )
}
