import { useEffect, useState } from "react";

const TYPE_ICONS = { CAR: "🚗", BIKE: "🚲", TRUCK: "🚛" };
const TYPE_LABELS = { CAR: "Voiture", BIKE: "Vélo", TRUCK: "Camion" };

const MONTH_NAMES = [
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
const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];

/* Couleurs par véhicule (rotation) */
const COLORS = [
  { bg: "#FF5F00", light: "rgba(255,95,0,.12)", text: "#FF5F00" },
  { bg: "#0095A8", light: "rgba(0,149,168,.12)", text: "#0095A8" },
  { bg: "#7C3AED", light: "rgba(124,58,237,.12)", text: "#7C3AED" },
  { bg: "#059669", light: "rgba(5,150,105,.12)", text: "#059669" },
  { bg: "#DC2626", light: "rgba(220,38,38,.12)", text: "#DC2626" },
  { bg: "#D97706", light: "rgba(217,119,6,.12)", text: "#D97706" },
];

export default function CalendarPage() {
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [filterType, setFilterType] = useState("ALL");
  const [tooltip, setTooltip] = useState(null); // { rental, x, y }

  useEffect(() => {
    Promise.all([
      fetch("/api/vehicles")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/rentals")
        .then((r) => r.json())
        .catch(() => []),
    ]).then(([v, r]) => {
      setVehicles(Array.isArray(v) ? v : []);
      setRentals(Array.isArray(r) ? r : []);
    });
  }, []);

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

  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    month.month === today.getMonth() &&
    month.year === today.getFullYear();

  const filteredVehicles =
    filterType === "ALL"
      ? vehicles
      : vehicles.filter((v) => v.type === filterType);

  /* Trouver rental pour un véhicule + jour */
  const getRentalForDay = (vehicleId, day) => {
    const d = new Date(month.year, month.month, day);
    return rentals.find(
      (r) =>
        r.vehicle?.id === vehicleId &&
        new Date(r.startDate) <= d &&
        new Date(r.endDate) >= d,
    );
  };

  /* Stats mois */
  const rentalsThisMonth = rentals.filter((r) => {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    const mStart = new Date(month.year, month.month, 1);
    const mEnd = new Date(month.year, month.month + 1, 0);
    return start <= mEnd && end >= mStart;
  });

  const tauxOccupation =
    vehicles.length && daysInMonth
      ? Math.round(
          (rentalsThisMonth.reduce((acc, r) => {
            const start = Math.max(
              new Date(r.startDate),
              new Date(month.year, month.month, 1),
            );
            const end = Math.min(
              new Date(r.endDate),
              new Date(month.year, month.month + 1, 0),
            );
            const days = Math.max(0, (end - start) / 86400000 + 1);
            return acc + days;
          }, 0) /
            (vehicles.length * daysInMonth)) *
            100,
        )
      : 0;

  const revenueThisMonth = rentalsThisMonth
    .reduce((s, r) => s + (r.totalPrice || 0), 0)
    .toFixed(0);

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
        })
      : "—";

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
            Administration · Calendrier flotte
          </p>
          <h1 className="text-[36px] font-black text-white tracking-tight leading-none">
            Disponibilités <span className="text-[#FF5F00]">Flotte</span>
          </h1>
        </div>
        <div className="flex gap-0">
          {[
            { val: `${tauxOccupation}%`, lbl: "Taux d'occupation" },
            { val: rentalsThisMonth.length, lbl: "Locations ce mois" },
            { val: `${revenueThisMonth}€`, lbl: "Revenus ce mois" },
          ].map(({ val, lbl }) => (
            <div
              key={lbl}
              className="text-center px-6 border-l border-white/[.08]"
            >
              <div className="text-[32px] font-black text-white leading-none tracking-tighter">
                {val}
              </div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mt-1">
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div
        className="bg-white border border-[#E0E0E0] rounded-sm px-6 py-4 mb-4 flex items-center justify-between"
        style={{ animation: "fadeUp .4s .08s ease both" }}
      >
        {/* Nav mois */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-sm text-[#666] hover:border-[#FF5F00] hover:text-[#FF5F00] transition-colors font-bold"
          >
            ‹
          </button>
          <span className="text-base font-black uppercase tracking-widest text-[#141414] min-w-[180px] text-center">
            {MONTH_NAMES[month.month]} {month.year}
          </span>
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-sm text-[#666] hover:border-[#FF5F00] hover:text-[#FF5F00] transition-colors font-bold"
          >
            ›
          </button>
          <button
            onClick={() =>
              setMonth({ year: today.getFullYear(), month: today.getMonth() })
            }
            className="ml-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#E0E0E0] rounded-sm text-[#666] hover:border-[#FF5F00] hover:text-[#FF5F00] transition-all"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Filtres type */}
        <div className="flex items-center gap-1.5">
          {[
            ["ALL", "Tous"],
            ["CAR", "🚗 Voitures"],
            ["BIKE", "🚲 Vélos"],
            ["TRUCK", "🚛 Camions"],
          ].map(([key, lbl]) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all ${
                filterType === key
                  ? "bg-[#FF5F00] border-[#FF5F00] text-white"
                  : "bg-[#F2F2F2] border-[#E0E0E0] text-[#AAAAAA] hover:border-[#FF5F00] hover:text-[#FF5F00]"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-[#FF5F00]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
              Loué
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-[#F2F2F2] border border-[#E0E0E0]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
              Libre
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-[#141414]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
              Aujourd'hui
            </span>
          </div>
        </div>
      </div>

      {/* ── GRILLE CALENDRIER GANTT ── */}
      <div
        className="bg-white border border-[#E0E0E0] rounded-sm overflow-hidden"
        style={{ animation: "fadeUp .4s .15s ease both" }}
      >
        {/* En-tête jours */}
        <div className="flex border-b-2 border-[#E0E0E0] bg-[#F2F2F2]">
          {/* Colonne véhicule */}
          <div className="w-48 flex-shrink-0 px-4 py-3 border-r border-[#E0E0E0]">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#AAAAAA]">
              Véhicule
            </span>
          </div>
          {/* Jours */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`flex-1 min-w-[28px] text-center py-2 border-r border-[#E0E0E0] last:border-0 ${isToday(day) ? "bg-[#141414]" : ""}`}
            >
              <div
                className={`text-[8px] font-black uppercase tracking-widest ${isToday(day) ? "text-[#FF5F00]" : "text-[#AAAAAA]"}`}
              >
                {
                  DAY_NAMES[
                    new Date(month.year, month.month, day).getDay() === 0
                      ? 6
                      : new Date(month.year, month.month, day).getDay() - 1
                  ]
                }
              </div>
              <div
                className={`text-[11px] font-black ${isToday(day) ? "text-white" : "text-[#1a1a1a]"}`}
              >
                {day}
              </div>
            </div>
          ))}
        </div>

        {/* Lignes véhicules */}
        {filteredVehicles.length === 0 ? (
          <div className="py-20 text-center">
            <span className="block text-5xl mb-3">🚗</span>
            <span className="text-[13px] font-bold uppercase tracking-widest text-[#AAAAAA]">
              Aucun véhicule dans cette catégorie
            </span>
          </div>
        ) : (
          filteredVehicles.map((v, vi) => {
            const color = COLORS[vi % COLORS.length];
            return (
              <div
                key={v.id}
                className="flex border-b border-[#E0E0E0] last:border-0 hover:bg-[#FFF8F5] transition-colors group"
              >
                {/* Infos véhicule */}
                <div className="w-48 flex-shrink-0 px-4 py-3 border-r border-[#E0E0E0] flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: color.light }}
                  >
                    {TYPE_ICONS[v.type]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#141414] truncate">
                      {v.brand}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#AAAAAA]">
                      {TYPE_LABELS[v.type]} · {v.basePricePerDay}€/j
                    </div>
                  </div>
                </div>

                {/* Jours */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const rental = getRentalForDay(v.id, day);
                    const today_c = isToday(day);
                    return (
                      <div
                        key={day}
                        onMouseEnter={
                          rental
                            ? (e) =>
                                setTooltip({
                                  rental,
                                  x: e.clientX,
                                  y: e.clientY,
                                })
                            : undefined
                        }
                        onMouseLeave={() => setTooltip(null)}
                        className={`flex-1 min-w-[28px] border-r border-[#E0E0E0] last:border-0 py-2.5 cursor-default transition-all ${
                          rental
                            ? "cursor-pointer"
                            : today_c
                              ? "bg-[#141414]/[.04]"
                              : ""
                        }`}
                        style={rental ? { background: color.bg } : undefined}
                      />
                    );
                  },
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── LISTE LOCATIONS DU MOIS ── */}
      {rentalsThisMonth.length > 0 && (
        <div
          className="mt-4 bg-white border border-[#E0E0E0] rounded-sm overflow-hidden"
          style={{ animation: "fadeUp .4s .2s ease both" }}
        >
          <div className="px-6 py-5 border-b border-[#E0E0E0] flex items-center justify-between">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#141414]">
              Locations — {MONTH_NAMES[month.month]} {month.year}
            </span>
            <span className="bg-[#FF5F00] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm">
              {rentalsThisMonth.length}
            </span>
          </div>
          <div className="divide-y divide-[#E0E0E0]">
            {rentalsThisMonth.map((r) => {
              const v = r.vehicle;
              const vi = vehicles.findIndex((vv) => vv.id === r.vehicle?.id);
              const color = COLORS[vi % COLORS.length];
              const done = new Date(r.endDate) < today;
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-6 py-3 hover:bg-[#FFF8F5] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ background: color.bg }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#141414]">
                          {r.customer?.name || "—"}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA]">
                          →
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: color.text }}
                        >
                          {v?.brand || "—"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#AAAAAA] font-medium">
                        {fmt(r.startDate)} → {fmt(r.endDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[18px] font-black text-[#141414]">
                      {r.totalPrice}
                      <span className="text-[13px] font-semibold text-[#FF5F00] ml-0.5">
                        €
                      </span>
                    </span>
                    {done ? (
                      <span className="bg-[#F2F2F2] text-[#AAAAAA] border border-[#E0E0E0] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                        Terminée
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip survol */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-[#141414] text-white rounded-sm px-4 py-3 shadow-2xl text-sm"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <p className="font-black text-[#FF5F00] text-[10px] uppercase tracking-widest mb-1">
            Location #{tooltip.rental.id}
          </p>
          <p className="font-bold">{tooltip.rental.customer?.name || "—"}</p>
          <p className="text-white/60 text-xs">
            {fmt(tooltip.rental.startDate)} → {fmt(tooltip.rental.endDate)}
          </p>
          <p className="text-[#FF5F00] font-black mt-1">
            {tooltip.rental.totalPrice}€
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
