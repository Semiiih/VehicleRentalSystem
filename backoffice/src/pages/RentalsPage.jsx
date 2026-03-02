import { useEffect, useState } from 'react'

const defaultForm = { vehicleId: '', customerId: '', startDate: '', endDate: '' }

const isFinished = (endDate) => endDate && new Date(endDate) < new Date(new Date().toDateString())

export default function RentalsPage() {
  const [rentals,   setRentals]   = useState([])
  const [vehicles,  setVehicles]  = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm]           = useState(defaultForm)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [filter, setFilter]       = useState('all') // all | active | done

  const fetchAll = async () => {
    try {
      const [r, v, c] = await Promise.all([
        fetch('/api/rentals').then(res => res.json()),
        fetch('/api/vehicles').then(res => res.json()),
        fetch('/api/customers').then(res => res.json()),
      ])
      setRentals(Array.isArray(r) ? r : [])
      setVehicles(Array.isArray(v) ? v : [])
      setCustomers(Array.isArray(c) ? c : [])
    } catch {}
  }

  useEffect(() => { fetchAll() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

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

  const getDays = () => {
    if (!form.startDate || !form.endDate) return 0
    const diff = (new Date(form.endDate) - new Date(form.startDate)) / 86400000
    return diff > 0 ? diff : 0
  }

  const previewPrice = () => {
    if (!form.vehicleId || !form.startDate || !form.endDate) return null
    const v = vehicles.find(v => v.id === parseInt(form.vehicleId))
    if (!v) return null
    const days = getDays()
    if (days <= 0) return null
    let price = v.basePricePerDay * days
    if (v.type === 'BIKE')  price *= 0.9
    if (v.type === 'TRUCK') price += 50
    return price.toFixed(2)
  }

  const filtered = rentals.filter(r => {
    if (filter === 'active') return !isFinished(r.endDate)
    if (filter === 'done')   return  isFinished(r.endDate)
    return true
  })

  const activeCount = rentals.filter(r => !isFinished(r.endDate)).length
  const doneCount   = rentals.filter(r =>  isFinished(r.endDate)).length
  const totalRevenu = rentals.reduce((s, r) => s + (r.totalPrice || 0), 0).toFixed(0)

  const inputCls    = "w-full bg-[#F2F2F2] border-[1.5px] border-[#E0E0E0] rounded-sm text-[#1a1a1a] text-sm font-medium px-3.5 py-2.5 outline-none focus:border-[#FF5F00] focus:bg-white transition-colors placeholder-[#BBBBBB]"
  const selectCls   = inputCls

  const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

  return (
    <div className="font-['Inter',sans-serif] bg-[#F2F2F2] min-h-screen p-8 pb-16">

      {/* ── HERO ── */}
      <div className="bg-[#141414] rounded-sm px-12 py-10 mb-7 flex items-center justify-between relative overflow-hidden"
           style={{ animation: 'fadeUp .4s ease both' }}>
        <div className="absolute top-0 right-0 w-72 h-full pointer-events-none"
             style={{ background: 'linear-gradient(135deg,transparent 40%,rgba(255,95,0,.12) 100%)' }} />
        <div>
          <p className="text-[11px] font-bold tracking-[.15em] uppercase text-[#FF5F00] mb-2.5">Administration · Gestion des locations</p>
          <h1 className="text-[36px] font-black text-white tracking-tight leading-none">
            Vos <span className="text-[#FF5F00]">Locations</span>
          </h1>
        </div>
        <div className="flex gap-0">
          {[
            { val: rentals.length, lbl: 'Total locations' },
            { val: activeCount, lbl: 'En cours' },
            { val: `${totalRevenu}€`, lbl: 'Chiffre d\'affaires' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="text-center px-6 border-l border-white/[.08]">
              <div className="text-[34px] font-black text-white leading-none tracking-tighter">{val}</div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mt-1">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="grid gap-4 items-start" style={{ gridTemplateColumns: '360px 1fr', animation: 'fadeUp .4s .1s ease both' }}>

        {/* Formulaire */}
        <div className="bg-white border border-[#E0E0E0] rounded-sm overflow-hidden sticky top-[76px]">
          <div className="px-6 py-5 border-b border-[#E0E0E0]">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414]">Créer une location</span>
          </div>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-[18px]">
            {error && (
              <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-sm text-xs font-semibold text-red-700">⚠ {error}</div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Véhicule</label>
              <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required className={selectCls}>
                <option value="">— Choisir un véhicule —</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>#{v.id} – {v.brand} ({v.type}) — {v.basePricePerDay} €/j</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Client</label>
              <select name="customerId" value={form.customerId} onChange={handleChange} required className={selectCls}>
                <option value="">— Choisir un client —</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>#{c.id} – {c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Début</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Fin</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required min={form.startDate || undefined} className={inputCls} />
              </div>
            </div>

            {/* Preview prix */}
            {previewPrice() && (
              <div className="bg-[#FF5F00]/[.06] border border-[#FF5F00]/20 rounded-sm px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF5F00]/70 mb-0.5">Estimation ({getDays()} jour{getDays() > 1 ? 's' : ''})</p>
                <p className="text-[28px] font-black text-[#FF5F00] leading-none tracking-tighter">
                  {previewPrice()} <span className="text-base font-bold">€</span>
                </p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#FF5F00] hover:bg-[#E05200] active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest rounded-sm transition-all">
              {loading ? 'Création…' : '+ Créer la location'}
            </button>
          </form>
        </div>

        {/* Tableau */}
        <div className="bg-white border border-[#E0E0E0] rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E0E0E0] flex items-center justify-between gap-4">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414] flex-shrink-0">Historique</span>

            {/* Filtres */}
            <div className="flex items-center gap-1.5">
              {[
                { key: 'all',    lbl: `Toutes (${rentals.length})` },
                { key: 'active', lbl: `En cours (${activeCount})` },
                { key: 'done',   lbl: `Terminées (${doneCount})` },
              ].map(({ key, lbl }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all ${
                    filter === key
                      ? 'bg-[#FF5F00] border-[#FF5F00] text-white'
                      : 'bg-[#F2F2F2] border-[#E0E0E0] text-[#AAAAAA] hover:border-[#FF5F00] hover:text-[#FF5F00]'
                  }`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F2F2F2] border-b-2 border-[#E0E0E0]">
                {['Réf.','Client','Véhicule','Début','Fin','Total','Statut'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#AAAAAA] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <span className="block text-5xl mb-3">📋</span>
                  <span className="text-[13px] font-bold uppercase tracking-widest text-[#AAAAAA]">Aucune location trouvée</span>
                </td></tr>
              ) : filtered.map(r => {
                const done = isFinished(r.endDate)
                return (
                  <tr key={r.id} className={`border-b border-[#E0E0E0] last:border-0 transition-colors ${done ? 'opacity-50' : 'hover:bg-[#FFF8F5]'}`}>
                    <td className="px-5 py-4 text-xs font-bold text-[#AAAAAA]">#{r.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-sm bg-[#FF5F00] flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
                          {r.customer?.name ? r.customer.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : '?'}
                        </div>
                        <span className="text-sm font-bold text-[#141414]">{r.customer?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">{r.vehicle?.brand || '—'}</td>
                    <td className="px-5 py-4 text-sm text-[#666]">{fmt(r.startDate)}</td>
                    <td className="px-5 py-4 text-sm text-[#666]">{fmt(r.endDate)}</td>
                    <td className="px-5 py-4 text-[18px] font-black text-[#141414]">
                      {r.totalPrice}<span className="text-[13px] font-semibold text-[#FF5F00] ml-0.5">€</span>
                    </td>
                    <td className="px-5 py-4">
                      {done ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#F2F2F2] text-[#AAAAAA] border border-[#E0E0E0] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                          ✓ Terminée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          En cours
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}