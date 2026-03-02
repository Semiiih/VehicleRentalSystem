import { useEffect, useRef, useState } from "react";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
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

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function VehicleCalendar({ vehicleId, onClose }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevVehicleId = useRef(vehicleId);

  useEffect(() => {
    if (prevVehicleId.current !== vehicleId) {
      prevVehicleId.current = vehicleId;
    }
    let cancelled = false;
    fetch(`/api/rentals/vehicle/${vehicleId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (!cancelled) setRentals(data); })
      .catch(() => { if (!cancelled) setRentals([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [vehicleId]);

  const isBooked = (dateStr) =>
    rentals.some((r) => dateStr >= r.startDate && dateStr <= r.endDate);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday=0 ... Sunday=6
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prev}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-700">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={next}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
          >
            →
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium"
          >
            ✕
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-8">Chargement…</p>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-gray-500 py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const dateStr = toDateStr(year, month, day);
              const booked = isBooked(dateStr);
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={dateStr}
                  className={`
                    text-center py-2 rounded-lg text-sm font-medium transition
                    ${
                      booked
                        ? "bg-red-500 text-white"
                        : "bg-green-100 text-green-800"
                    }
                    ${isToday ? "ring-2 ring-blue-500" : ""}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />{" "}
              Disponible
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" /> Loué
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded ring-2 ring-blue-500 bg-white" />{" "}
              Aujourd'hui
            </span>
          </div>
        </>
      )}
    </div>
  );
}
