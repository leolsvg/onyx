// components/views/ProjectionView.tsx
import { Card } from "@/components/ui/Card";
import { GlobalStats, LifeEvent } from "@/lib/types";
import { Calendar, Plus, Trash2, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  stats: GlobalStats; // Pour récupérer le patrimoine initial
}

export default function ProjectionView({ stats }: Props) {
  // Paramètres de simulation
  const [monthlySavings, setMonthlySavings] = useState(500);
  const [duration, setDuration] = useState(20);
  const [returnRate, setReturnRate] = useState(5); // 5% conservateur
  const [events, setEvents] = useState<LifeEvent[]>([]);

  // Inputs pour nouvel événement
  const [newEventName, setNewEventName] = useState("");
  const [newEventYear, setNewEventYear] = useState("");
  const [newEventAmount, setNewEventAmount] = useState("");
  const [newEventType, setNewEventType] = useState<"deposit" | "withdrawal">(
    "withdrawal"
  );

  const addEvent = () => {
    if (newEventName && newEventYear && newEventAmount) {
      setEvents(
        [
          ...events,
          {
            id: Date.now().toString(),
            name: newEventName,
            yearOffset: parseInt(newEventYear),
            amount: parseFloat(newEventAmount),
            type: newEventType,
          },
        ].sort((a, b) => a.yearOffset - b.yearOffset)
      );
      setNewEventName("");
      setNewEventYear("");
      setNewEventAmount("");
    }
  };

  // --- MOTEUR DE CALCUL PROJECTION ---
  const projectionData = useMemo(() => {
    let currentWealth = stats.netWealth;
    let totalInvested = stats.netWealth; // Juste le capital versé
    const data = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= duration; i++) {
      const yearLabel = currentYear + i;

      // 1. Appliquer les événements de cette année
      const yearEvents = events.filter((e) => e.yearOffset === i);
      let flowImpact = 0;

      yearEvents.forEach((e) => {
        if (e.type === "withdrawal") {
          currentWealth -= e.amount;
          flowImpact -= e.amount;
        } else {
          currentWealth += e.amount;
          totalInvested += e.amount;
          flowImpact += e.amount;
        }
      });

      // 2. Sauvegarder le point de données (avant intérêts de l'année pour lecture plus claire)
      data.push({
        year: yearLabel,
        wealth: Math.round(currentWealth),
        invested: Math.round(totalInvested),
        events: yearEvents, // Pour afficher des marqueurs si besoin
      });

      // 3. Calcul Intérêts & Épargne pour l'année suivante
      // Intérêts composés
      const interests = currentWealth * (returnRate / 100);
      currentWealth += interests;

      // Ajout épargne mensuelle (DCA)
      const annualSavings = monthlySavings * 12;
      currentWealth += annualSavings;
      totalInvested += annualSavings;
    }

    return data;
  }, [stats.netWealth, monthlySavings, duration, returnRate, events]);

  const finalWealth = projectionData[projectionData.length - 1].wealth;
  const totalGain =
    finalWealth - projectionData[projectionData.length - 1].invested;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* KPI SIMULATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border-indigo-500/30">
          <div className="text-indigo-400 font-bold mb-1 flex items-center gap-2">
            <TrendingUp size={18} /> Patrimoine à {duration} ans
          </div>
          <div className="text-3xl font-bold text-white">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(finalWealth)}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Dont intérêts :{" "}
            <span className="text-green-400">
              +
              {new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(
                totalGain
              )}
              €
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-gray-400 text-xs uppercase mb-1">
            Effort d'épargne
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              className="accent-blue-500"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
            />
            <span className="font-bold text-white text-xl">
              {monthlySavings} €/mois
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-gray-400 text-xs uppercase mb-1">
            Rendement Moyen
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              className="accent-green-500"
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
            />
            <span className="font-bold text-green-400 text-xl">
              {returnRate}% /an
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPHIQUE */}
        <Card className="lg:col-span-2 h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm uppercase">
              Trajectoire Patrimoniale
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDuration(10)}
                className={`px-3 py-1 rounded text-xs ${
                  duration === 10
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                10 ans
              </button>
              <button
                onClick={() => setDuration(25)}
                className={`px-3 py-1 rounded text-xs ${
                  duration === 25
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                25 ans
              </button>
              <button
                onClick={() => setDuration(50)}
                className={`px-3 py-1 rounded text-xs ${
                  duration === 50
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                50 ans
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="90%">
            <AreaChart
              data={projectionData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="year"
                stroke="#475569"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#475569"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat("fr-FR").format(value) + " €",
                  name === "wealth" ? "Patrimoine Total" : "Capital Investi",
                ]}
                labelStyle={{ color: "#94a3b8", marginBottom: "5px" }}
              />
              <Area
                type="monotone"
                dataKey="invested"
                stackId="1"
                stroke="#94a3b8"
                fill="url(#colorInvested)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="wealth"
                stackId="2"
                stroke="#6366f1"
                fill="url(#colorWealth)"
                strokeWidth={3}
              />

              {/* Lignes verticales pour les événements */}
              {events.map((e, i) => (
                <ReferenceLine
                  key={i}
                  x={new Date().getFullYear() + e.yearOffset}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: "📍", position: "insideTop" }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* GESTION DES ÉVÉNEMENTS DE VIE */}
        <Card className="h-[500px] flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-yellow-500 text-sm uppercase border-b border-gray-800 pb-2">
            <Calendar size={18} /> Événements de vie
          </h3>

          {/* Formulaire */}
          <div className="bg-gray-800/30 p-3 rounded-lg mb-4 border border-gray-700/50">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nom (ex: Achat Immo)"
                className="bg-black/30 border border-gray-600 rounded p-2 text-xs w-full text-white"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
              <select
                className="bg-black/30 border border-gray-600 rounded p-2 text-xs text-white outline-none"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as any)}
              >
                <option value="withdrawal">Dépense (-)</option>
                <option value="deposit">Rentrée (+)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Dans X ans"
                  className="bg-black/30 border border-gray-600 rounded p-2 text-xs w-full text-white pl-8"
                  value={newEventYear}
                  onChange={(e) => setNewEventYear(e.target.value)}
                />
                <span className="absolute left-2 top-2 text-gray-500 text-xs">
                  An
                </span>
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Montant"
                  className="bg-black/30 border border-gray-600 rounded p-2 text-xs w-full text-white pl-6"
                  value={newEventAmount}
                  onChange={(e) => setNewEventAmount(e.target.value)}
                />
                <span className="absolute left-2 top-2 text-gray-500 text-xs">
                  €
                </span>
              </div>
              <button
                onClick={addEvent}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Liste Timeline */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 text-xs italic py-4">
                Aucun événement planifié.
              </div>
            ) : (
              events.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#161b26] border border-gray-800 relative overflow-hidden"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      e.type === "withdrawal" ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex flex-col items-center min-w-[40px]">
                    <span className="text-xs text-gray-500 font-bold">
                      +{e.yearOffset} ans
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {new Date().getFullYear() + e.yearOffset}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{e.name}</div>
                    <div
                      className={`text-xs ${
                        e.type === "withdrawal"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {e.type === "withdrawal" ? "-" : "+"}
                      {new Intl.NumberFormat("fr-FR").format(e.amount)} €
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setEvents(events.filter((ev) => ev.id !== e.id))
                    }
                    className="text-gray-600 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}

            {/* Indicateur Fin */}
            <div className="flex items-center gap-3 p-3 opacity-50">
              <div className="min-w-[40px] text-center text-xs text-gray-600">
                +{duration} ans
              </div>
              <div className="text-xs text-gray-600">Horizon de projection</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
