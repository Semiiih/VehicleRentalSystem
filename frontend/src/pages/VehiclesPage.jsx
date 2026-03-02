import { useEffect, useState } from 'react'

const TYPE_LABELS = { CAR: '🚗 Voiture', BIKE: '🚲 Vélo', TRUCK: '🚛 Camion' }

const defaultForm = {
  type: 'CAR',
  brand: '',
  basePricePerDay: '',
  numberOfDoors: '',
  electric: false,
  loadCapacity: '',
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles')
    setVehicles(await res.json())
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce véhicule ? Ses locations associées seront aussi supprimées.')) return
    await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
    fetchVehicles()
  }

  useEffect(() => { fetchVehicles() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const body = {
      type: form.type,
      brand: form.brand,
      basePricePerDay: parseFloat(form.basePricePerDay),
      ...(form.type === 'CAR' && { numberOfDoors: parseInt(form.numberOfDoors) }),
      ...(form.type === 'BIKE' && { electric: form.electric }),
      ...(form.type === 'TRUCK' && { loadCapacity: parseFloat(form.loadCapacity) }),
    }
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      setForm(defaultForm)
      fetchVehicles()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Véhicules</h1>

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Ajouter un véhicule</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="CAR">Voiture</option>
              <option value="BIKE">Vélo</option>
              <option value="TRUCK">Camion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Marque</label>
            <input name="brand" value={form.brand} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ex: Toyota Corolla" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Prix / jour (€)</label>
            <input name="basePricePerDay" type="number" min="0" step="0.01"
              value={form.basePricePerDay} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ex: 50" />
          </div>

          {form.type === 'CAR' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de portes</label>
              <input name="numberOfDoors" type="number" min="2" max="5"
                value={form.numberOfDoors} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ex: 4" />
            </div>
          )}

          {form.type === 'BIKE' && (
            <div className="flex items-center gap-3 pt-6">
              <input name="electric" type="checkbox" checked={form.electric} onChange={handleChange}
                className="h-4 w-4 accent-blue-600" id="electric" />
              <label htmlFor="electric" className="text-sm font-medium text-gray-600">Électrique</label>
            </div>
          )}

          {form.type === 'TRUCK' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Capacité de charge (kg)</label>
              <input name="loadCapacity" type="number" min="0"
                value={form.loadCapacity} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ex: 5000" />
            </div>
          )}

          <div className="col-span-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? 'Ajout...' : 'Ajouter le véhicule'}
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
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Marque</th>
              <th className="px-4 py-3 text-left">Prix / jour</th>
              <th className="px-4 py-3 text-left">Détails</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Aucun véhicule</td></tr>
            )}
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">#{v.id}</td>
                <td className="px-4 py-3 font-medium">{TYPE_LABELS[v.type] || v.type}</td>
                <td className="px-4 py-3">{v.brand}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">{v.basePricePerDay} €</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {v.type === 'CAR' && `${v.numberOfDoors} portes`}
                  {v.type === 'BIKE' && (v.electric ? '⚡ Électrique' : 'Non électrique')}
                  {v.type === 'TRUCK' && `${v.loadCapacity} kg`}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(v.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium transition">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
