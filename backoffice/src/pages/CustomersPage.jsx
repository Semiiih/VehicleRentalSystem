import { useEffect, useState } from 'react'

const defaultForm = { name: '', email: '', phoneNumber: '' }

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [form, setForm]           = useState(defaultForm)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')

  const fetchCustomers = async () => {
    try {
      const res  = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(Array.isArray(data) ? data : [])
    } catch { setCustomers([]) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce client ? Ses locations associées seront aussi supprimées.')) return
    await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    fetchCustomers()
  }

  useEffect(() => { fetchCustomers() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      setForm(defaultForm)
      fetchCustomers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  )

  const inputCls = "w-full bg-[#F2F2F2] border-[1.5px] border-[#E0E0E0] rounded-sm text-[#1a1a1a] text-sm font-medium px-3.5 py-2.5 outline-none focus:border-[#FF5F00] focus:bg-white transition-colors placeholder-[#BBBBBB]"

  /* Initiales avatar */
  const initials = (name) => name ? name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : '?'

  return (
    <div className="font-['Inter',sans-serif] bg-[#F2F2F2] min-h-screen p-8 pb-16">

      {/* ── HERO ── */}
      <div className="bg-[#141414] rounded-sm px-12 py-10 mb-7 flex items-center justify-between relative overflow-hidden"
           style={{ animation: 'fadeUp .4s ease both' }}>
        <div className="absolute top-0 right-0 w-72 h-full pointer-events-none"
             style={{ background: 'linear-gradient(135deg,transparent 40%,rgba(255,95,0,.12) 100%)' }} />
        <div>
          <p className="text-[11px] font-bold tracking-[.15em] uppercase text-[#FF5F00] mb-2.5">Administration · Base clients</p>
          <h1 className="text-[36px] font-black text-white tracking-tight leading-none">
            Vos <span className="text-[#FF5F00]">Clients</span>
          </h1>
        </div>
        <div className="flex gap-0">
          {[
            { val: customers.length, lbl: 'Total clients' },
            { val: filtered.length, lbl: 'Résultats filtrés' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="text-center px-6 border-l border-white/[.08]">
              <div className="text-[40px] font-black text-white leading-none tracking-tighter">{val}</div>
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
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414]">Nouveau client</span>
          </div>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-[18px]">
            {error && (
              <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-sm text-xs font-semibold text-red-700">⚠ {error}</div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Nom complet</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="ex : Jean Dupont" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Adresse email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="ex : jean@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">Téléphone</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required placeholder="ex : 0612345678" className={inputCls} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#FF5F00] hover:bg-[#E05200] active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest rounded-sm transition-all">
              {loading ? 'Enregistrement…' : '+ Ajouter le client'}
            </button>
          </form>
        </div>

        {/* Tableau */}
        <div className="bg-white border border-[#E0E0E0] rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E0E0E0] flex items-center justify-between gap-4">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414] flex-shrink-0">Base clients</span>
            {/* Recherche */}
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="bg-[#F2F2F2] border-[1.5px] border-[#E0E0E0] rounded-sm text-sm font-medium px-3 py-1.5 outline-none focus:border-[#FF5F00] transition-colors text-[#1a1a1a] placeholder-[#AAAAAA] w-48"
            />
            <span className="bg-[#FF5F00] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm tracking-wide flex-shrink-0">
              {filtered.length} client{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F2F2F2] border-b-2 border-[#E0E0E0]">
                {['Réf.','Client','Email','Téléphone',''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#AAAAAA]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center">
                  <span className="block text-5xl mb-3">👤</span>
                  <span className="text-[13px] font-bold uppercase tracking-widest text-[#AAAAAA]">
                    {search ? 'Aucun résultat pour cette recherche' : 'Aucun client — commencez par en ajouter un'}
                  </span>
                </td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-[#E0E0E0] last:border-0 hover:bg-[#FFF8F5] transition-colors">
                  <td className="px-5 py-4 text-xs font-bold text-[#AAAAAA]">#{c.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initiales */}
                      <div className="w-8 h-8 rounded-sm bg-[#FF5F00] flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
                        {initials(c.name)}
                      </div>
                      <span className="text-[15px] font-bold text-[#141414]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`mailto:${c.email}`} className="text-sm text-[#FF5F00] font-medium hover:underline">{c.email}</a>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">{c.phoneNumber}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleDelete(c.id)}
                      className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 border-[1.5px] border-[#E0E0E0] rounded-sm text-[#AAAAAA] hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-all">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
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