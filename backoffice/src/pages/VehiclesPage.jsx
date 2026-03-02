import { useEffect, useState } from "react";

const TYPE_LABELS = { CAR: "Voiture", BIKE: "Vélo", TRUCK: "Camion" };
const TYPE_ICONS = { CAR: "🚗", BIKE: "🚲", TRUCK: "🚛" };

const defaultForm = {
  type: "CAR",
  brand: "",
  basePricePerDay: "",
  numberOfDoors: "",
  electric: false,
  loadCapacity: "",
};

/* ── Inline calendar modal ───────────────────────────────────────────── */
function VehicleCalendarModal({ vehicleId, brand, onClose }) {
  const [rentals, setRentals] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  useEffect(() => {
    fetch(`/api/vehicles/${vehicleId}/rentals`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRentals(Array.isArray(data) ? data : []))
      .catch(() => setRentals([]));
  }, [vehicleId]);

  const firstDay = new Date(month.year, month.month, 1);
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const isRented = (day) => {
    const d = new Date(month.year, month.month, day);
    return rentals.some((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return d >= start && d <= end;
    });
  };

  const getRentalInfo = (day) => {
    const d = new Date(month.year, month.month, day);
    return rentals.find((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return d >= start && d <= end;
    });
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const prev = () =>
    setMonth((m) => {
      const d = new Date(m.year, m.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  const next = () =>
    setMonth((m) => {
      const d = new Date(m.year, m.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-sm shadow-2xl w-[520px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#141414] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#FF5F00]">
              Disponibilités
            </p>
            <p className="text-white font-black text-lg tracking-tight">
              {brand}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Nav mois */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-sm text-[#666] hover:border-[#FF5F00] hover:text-[#FF5F00] transition-colors text-sm font-bold"
          >
            ‹
          </button>
          <span className="text-sm font-black uppercase tracking-widest text-[#141414]">
            {monthNames[month.month]} {month.year}
          </span>
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-sm text-[#666] hover:border-[#FF5F00] hover:text-[#FF5F00] transition-colors text-sm font-bold"
          >
            ›
          </button>
        </div>

        {/* Grille */}
        <div className="p-5">
          {/* Jours semaine */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] font-bold uppercase tracking-widest text-[#AAAAAA] py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Cases */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const rented = isRented(day);
              const info = getRentalInfo(day);
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                month.month === today.getMonth() &&
                month.year === today.getFullYear();
              return (
                <div
                  key={day}
                  title={
                    info
                      ? `${info.customer?.name || "Client"} · ${info.startDate} → ${info.endDate}`
                      : ""
                  }
                  className={`
                    h-9 flex items-center justify-center rounded-sm text-xs font-bold transition-all
                    ${
                      rented
                        ? "bg-[#FF5F00] text-white"
                        : isToday
                          ? "bg-[#141414] text-white"
                          : "bg-[#F2F2F2] text-[#1a1a1a] hover:bg-[#E0E0E0]"
                    }
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#E0E0E0]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#FF5F00]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                Loué
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#F2F2F2] border border-[#E0E0E0]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                Disponible
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#141414]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                Aujourd'hui
              </span>
            </div>
          </div>

          {/* Locations listées */}
          {rentals.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#AAAAAA]">
                Locations actives
              </p>
              {rentals.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-[#F2F2F2] rounded-sm px-3 py-2"
                >
                  <div>
                    <span className="text-xs font-bold text-[#141414]">
                      {r.customer?.name || "—"}
                    </span>
                    <span className="text-[10px] text-[#AAAAAA] ml-2">
                      {r.startDate} → {r.endDate}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#FF5F00]">
                    {r.totalPrice}€
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────────────────── */
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calendarVehicle, setCalendarVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setVehicles([]);
      setError(err.message || "Erreur de chargement");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Supprimer ce véhicule ? Ses locations associées seront aussi supprimées.",
      )
    )
      return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    fetchVehicles();
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = {
      type: form.type,
      brand: form.brand,
      basePricePerDay: parseFloat(form.basePricePerDay),
      ...(form.type === "CAR" && {
        numberOfDoors: parseInt(form.numberOfDoors),
      }),
      ...(form.type === "BIKE" && { electric: form.electric }),
      ...(form.type === "TRUCK" && {
        loadCapacity: parseFloat(form.loadCapacity),
      }),
    };
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setForm(defaultForm);
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const avgPrice = vehicles.length
    ? (
        vehicles.reduce((s, v) => s + v.basePricePerDay, 0) / vehicles.length
      ).toFixed(0)
    : 0;

  /* ── INPUT classes réutilisables ── */
  const inputCls =
    "w-full bg-[#F2F2F2] border-[1.5px] border-[#E0E0E0] rounded-sm text-[#1a1a1a] text-sm font-medium px-3.5 py-2.5 outline-none focus:border-[#FF5F00] focus:bg-white transition-colors placeholder-[#BBBBBB]";

  return (
    <div className="font-['Inter',sans-serif] bg-[#F2F2F2] min-h-screen p-8 pb-16">
      {/* ── HERO ── */}
      <div
        className="bg-[#141414] rounded-sm px-12 py-10 mb-7 flex items-center justify-between relative overflow-hidden"
        style={{ animation: "fadeUp .4s ease both" }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg,transparent 40%,rgba(255,95,0,.12) 100%)",
          }}
        />
        <div>
          <p className="text-[11px] font-bold tracking-[.15em] uppercase text-[#FF5F00] mb-2.5">
            Administration · Gestion de flotte
          </p>
          <h1 className="text-[36px] font-black text-white tracking-tight leading-none">
            Vos <span className="text-[#FF5F00]">Véhicules</span>
          </h1>
        </div>
        <div className="flex gap-0">
          {[
            { val: vehicles.length, suffix: null, lbl: "Total flotte" },
            { val: avgPrice, suffix: "€", lbl: "Prix moyen / jour" },
            {
              val: [...new Set(vehicles.map((v) => v.type))].length,
              suffix: null,
              lbl: "Catégories",
            },
          ].map(({ val, suffix, lbl }) => (
            <div
              key={lbl}
              className="text-center px-6 border-l border-white/[.08]"
            >
              <div className="text-[40px] font-black text-white leading-none tracking-tighter">
                {val}
                {suffix && (
                  <span className="text-xl text-[#FF5F00] font-bold">
                    {suffix}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mt-1">
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div
        className="grid grid-cols-3 gap-3 mb-7"
        style={{ animation: "fadeUp .4s .08s ease both" }}
      >
        {["CAR", "BIKE", "TRUCK"].map((t) => (
          <div
            key={t}
            className="bg-white border border-[#E0E0E0] rounded-sm p-6 flex items-center gap-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="w-12 h-12 bg-[#FF5F00]/[.08] rounded-sm flex items-center justify-center text-[22px] flex-shrink-0">
              {TYPE_ICONS[t]}
            </div>
            <div>
              <div className="text-[28px] font-black text-[#141414] tracking-tighter leading-none">
                {vehicles.filter((v) => v.type === t).length}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#AAAAAA] mt-1">
                {TYPE_LABELS[t]}
                {vehicles.filter((v) => v.type === t).length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── LAYOUT ── */}
      <div
        className="grid gap-4 items-start"
        style={{
          gridTemplateColumns: "360px 1fr",
          animation: "fadeUp .4s .15s ease both",
        }}
      >
        {/* Formulaire */}
        <div className="bg-white border border-[#E0E0E0] rounded-sm overflow-hidden sticky top-[76px]">
          <div className="px-6 py-5 border-b border-[#E0E0E0] flex items-center justify-between">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414]">
              Ajouter un véhicule
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-6 flex flex-col gap-[18px]"
          >
            {error && (
              <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-sm text-xs font-semibold text-red-700">
                ⚠ {error}
              </div>
            )}

            {/* Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">
                Catégorie
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["CAR", "BIKE", "TRUCK"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                      form.type === t
                        ? "bg-[#FF5F00] border-[#FF5F00] text-white"
                        : "bg-[#F2F2F2] border-[#E0E0E0] text-[#AAAAAA] hover:border-[#FF5F00] hover:text-[#FF5F00] hover:bg-[#FF5F00]/[.04]"
                    }`}
                  >
                    <span className="block text-xl mb-1">{TYPE_ICONS[t]}</span>
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">
                Marque & Modèle
              </label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                placeholder="ex : BMW X5"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">
                Prix par jour (€)
              </label>
              <input
                name="basePricePerDay"
                type="number"
                min="0"
                step="0.01"
                value={form.basePricePerDay}
                onChange={handleChange}
                required
                placeholder="ex : 89"
                className={inputCls}
              />
            </div>

            {form.type === "CAR" && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">
                  Nombre de portes
                </label>
                <input
                  name="numberOfDoors"
                  type="number"
                  min="2"
                  max="5"
                  value={form.numberOfDoors}
                  onChange={handleChange}
                  required
                  placeholder="ex : 4"
                  className={inputCls}
                />
              </div>
            )}

            {form.type === "BIKE" && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">
                  Vélorisation
                </label>
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, electric: !f.electric }))
                  }
                  className="flex items-center gap-3 px-3.5 py-2.5 bg-[#F2F2F2] border-[1.5px] border-[#E0E0E0] rounded-sm cursor-pointer hover:border-[#FF5F00] transition-colors"
                >
                  <div
                    className={`w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-all ${
                      form.electric
                        ? "bg-[#FF5F00] border-[#FF5F00]"
                        : "bg-white border-[#E0E0E0]"
                    }`}
                  >
                    {form.electric && (
                      <span className="text-white text-[11px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    Vélo électrique
                  </span>
                </div>
              </div>
            )}

            {form.type === "TRUCK" && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#666] mb-1.5">
                  Charge utile (kg)
                </label>
                <input
                  name="loadCapacity"
                  type="number"
                  min="0"
                  value={form.loadCapacity}
                  onChange={handleChange}
                  required
                  placeholder="ex : 3500"
                  className={inputCls}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF5F00] hover:bg-[#E05200] active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest rounded-sm transition-all"
            >
              {loading ? "Enregistrement…" : "+ Ajouter au catalogue"}
            </button>
          </form>
        </div>

        {/* Tableau */}
        <div className="bg-white border border-[#E0E0E0] rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E0E0E0] flex items-center justify-between">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414]">
              Catalogue de véhicules
            </span>
            <span className="bg-[#FF5F00] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm tracking-wide">
              {vehicles.length} véhicule{vehicles.length !== 1 ? "s" : ""}
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F2F2F2] border-b-2 border-[#E0E0E0]">
                {["Réf.", "Type", "Modèle", "Tarif / jour", "Détails", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#AAAAAA] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <span className="block text-5xl mb-3">🚗</span>
                    <span className="text-[13px] font-bold uppercase tracking-widest text-[#AAAAAA]">
                      Aucun véhicule — commencez par en ajouter un
                    </span>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-[#E0E0E0] last:border-0 hover:bg-[#FFF8F5] transition-colors"
                  >
                    <td className="px-5 py-4 text-xs font-bold text-[#AAAAAA]">
                      #{v.id}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#FF5F00]/[.08] text-[#FF5F00] border border-[#FF5F00]/20 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                        {TYPE_ICONS[v.type]} {TYPE_LABELS[v.type] || v.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[15px] font-bold text-[#141414]">
                      {v.brand}
                    </td>
                    <td className="px-5 py-4 text-[18px] font-black text-[#141414]">
                      {v.basePricePerDay}
                      <span className="text-[13px] font-semibold text-[#FF5F00] ml-0.5">
                        €
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-[#AAAAAA]">
                      {v.type === "CAR" && `${v.numberOfDoors} portes`}
                      {v.type === "BIKE" &&
                        (v.electric ? (
                          <span className="inline-flex items-center gap-1 text-[#0095A8] bg-[#0095A8]/[.08] border border-[#0095A8]/20 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                            ⚡ Électrique
                          </span>
                        ) : (
                          "Mécanique"
                        ))}
                      {v.type === "TRUCK" && `${v.loadCapacity} kg`}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCalendarVehicle(v)}
                          className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 border-[1.5px] border-[#E0E0E0] rounded-sm text-[#666] hover:border-[#FF5F00] hover:text-[#FF5F00] transition-all"
                        >
                          📅
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 border-[1.5px] border-[#E0E0E0] rounded-sm text-[#AAAAAA] hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-all"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal calendrier */}
      {calendarVehicle && (
        <VehicleCalendarModal
          vehicleId={calendarVehicle.id}
          brand={calendarVehicle.brand}
          onClose={() => setCalendarVehicle(null)}
        />
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
