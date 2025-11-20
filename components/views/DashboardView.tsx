import { Card } from "@/components/ui/Card";
import { COLORS } from "@/lib/constants";
import { Asset, Envelope, GlobalStats, Objective } from "@/lib/types";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle,
  Landmark,
  Lightbulb,
  Link as LinkIcon,
  ShieldAlert,
  Target,
  Trash2,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  stats: GlobalStats;
  assets: Asset[];
  envelopes: Envelope[];
  objectives: Objective[];
  addObjective: (name: string, target: number, linkedIds: string[]) => void;
  deleteObjective: (id: string) => void;
}

export default function DashboardView({
  stats,
  assets,
  envelopes,
  objectives,
  addObjective,
  deleteObjective,
}: Props) {
  const [newObjName, setNewObjName] = useState("");
  const [newObjTarget, setNewObjTarget] = useState("");
  const [selectedLink, setSelectedLink] = useState("");
  const [tempLinkedIds, setTempLinkedIds] = useState<string[]>([]);

  // --- LOGIQUE DE LIAISON ---
  const handleAddLink = () => {
    if (selectedLink && !tempLinkedIds.includes(selectedLink)) {
      setTempLinkedIds([...tempLinkedIds, selectedLink]);
      setSelectedLink("");
    }
  };

  const handleCreate = () => {
    if (newObjName && newObjTarget) {
      addObjective(newObjName, parseFloat(newObjTarget), tempLinkedIds);
      setNewObjName("");
      setNewObjTarget("");
      setTempLinkedIds([]);
    }
  };

  const getLinkDetails = (id: string) => {
    const env = envelopes.find((e) => e.id === id);
    if (env) {
      const val = assets
        .filter((a) => a.envelopeId === env.id)
        .reduce((s, a) => s + a.amount * a.unitPrice, 0);
      return { name: env.name, type: "envelope", value: val };
    }
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      return {
        name: asset.name,
        type: "asset",
        value: asset.amount * asset.unitPrice,
      };
    }
    return { name: "Inconnu", type: "unknown", value: 0 };
  };

  const getProgress = (linkedIds: string[]) => {
    if (!linkedIds || linkedIds.length === 0) return 0;
    return linkedIds.reduce((sum, id) => sum + getLinkDetails(id).value, 0);
  };

  // --- DONNÉES GRAPHIQUES ---
  const scoreData = [
    {
      name: "Score",
      value: stats.finaryScore,
      fill:
        stats.finaryScore > 70
          ? "#10b981"
          : stats.finaryScore > 50
          ? "#f59e0b"
          : "#ef4444",
    },
  ];

  const allocationData = assets
    .reduce((acc: any[], curr) => {
      const exist = acc.find((x: any) => x.name === curr.category);
      exist
        ? (exist.value += curr.amount * curr.unitPrice)
        : acc.push({
            name: curr.category,
            value: curr.amount * curr.unitPrice,
          });
      return acc;
    }, [])
    .sort((a: any, b: any) => b.value - a.value);

  let safetyColor = "text-red-400";
  let safetyBg = "bg-red-500/10";
  if (stats.runwayMonths >= 6) {
    safetyColor = "text-[#15803d]";
    safetyBg = "bg-[#15803d]/10";
  } else if (stats.runwayMonths >= 3) {
    safetyColor = "text-green-400";
    safetyBg = "bg-green-500/10";
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-500/30 md:col-span-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">
            <Landmark size={16} /> Patrimoine Net Réel
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(stats.netWealth)}
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>
              Brut:{" "}
              {new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(
                stats.grossAssets
              )}
              €
            </span>
            <span className="text-orange-400 font-bold">
              Impôts: -{Math.round(stats.potentialTax).toLocaleString()}€
            </span>
          </div>
        </Card>

        <Card className="relative overflow-hidden flex flex-col justify-center items-center">
          <div className="absolute top-4 left-4 text-gray-400 text-xs uppercase font-bold flex items-center gap-1">
            <Trophy size={12} className="text-yellow-500" /> Score Expert
          </div>
          <div className="relative w-32 h-32 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                barSize={10}
                data={scoreData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-[-20px]">
              <span
                className={`text-3xl font-bold ${
                  stats.finaryScore > 70
                    ? "text-green-400"
                    : stats.finaryScore > 50
                    ? "text-orange-400"
                    : "text-red-400"
                }`}
              >
                {stats.finaryScore}/100
              </span>
            </div>
          </div>
        </Card>

        <Card className={`${safetyBg} border-none`}>
          <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
            <ShieldAlert size={12} /> Matelas Sécurité
          </div>
          <div className={`text-3xl font-bold ${safetyColor}`}>
            {stats.runwayMonths.toFixed(1)} Mois
          </div>
          <div className="text-xs text-gray-500 mt-1">Objectif: 6 mois</div>
          <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full ${
                stats.runwayMonths >= 6
                  ? "bg-[#15803d]"
                  : stats.runwayMonths >= 3
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
              style={{
                width: `${Math.min((stats.runwayMonths / 6) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-[500px]">
          <h3 className="font-bold mb-4 text-white text-sm uppercase">
            Allocation
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={allocationData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {allocationData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#11141d", border: "none" }}
                formatter={(val: number) => val.toLocaleString() + " €"}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-gray-400 text-xs ml-1">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* OBJECTIFS */}
          <Card>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400 text-sm uppercase border-b border-gray-800 pb-2">
              <Target size={18} /> Objectifs & Projets
            </h3>

            {/* Formulaire d'ajout */}
            <div className="bg-black/20 p-3 rounded-lg mb-6 border border-gray-800">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nom (ex: Retraite)"
                  className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-full"
                  value={newObjName}
                  onChange={(e) => setNewObjName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Cible (€)"
                  className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-32"
                  value={newObjTarget}
                  onChange={(e) => setNewObjTarget(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <select
                    className="bg-black/30 border border-gray-700 rounded p-2 text-xs flex-1 outline-none"
                    value={selectedLink}
                    onChange={(e) => setSelectedLink(e.target.value)}
                  >
                    <option value="">Lier une source...</option>
                    <optgroup label="📦 Enveloppes">
                      {envelopes.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="📄 Actifs">
                      {assets.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <button
                    onClick={handleAddLink}
                    className="bg-gray-700 text-white rounded px-3"
                  >
                    <LinkIcon size={14} />
                  </button>
                </div>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white rounded px-4 text-xs font-bold"
                >
                  Créer
                </button>
              </div>
              {/* Badges des liens temporaires */}
              {tempLinkedIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempLinkedIds.map((id) => {
                    const d = getLinkDetails(id);
                    return (
                      <span
                        key={id}
                        className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded flex items-center gap-1"
                      >
                        {d.type === "envelope" ? "📦" : "📄"} {d.name}{" "}
                        <button
                          onClick={() =>
                            setTempLinkedIds(
                              tempLinkedIds.filter((tid) => tid !== id)
                            )
                          }
                        >
                          <X size={10} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Liste */}
            <div className="space-y-4">
              {objectives.map((obj) => {
                const current =
                  obj.linkedIds && obj.linkedIds.length > 0
                    ? getProgress(obj.linkedIds)
                    : 0;
                const percent = Math.min(
                  (current / obj.targetAmount) * 100,
                  100
                );
                return (
                  <div
                    key={obj.id}
                    className="bg-[#161b26] p-3 rounded-xl border border-gray-800"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold">{obj.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">
                          {percent.toFixed(1)}%
                        </span>
                        <button onClick={() => deleteObjective(obj.id)}>
                          <Trash2
                            size={12}
                            className="text-gray-600 hover:text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span className="text-gray-300">
                        {new Intl.NumberFormat("fr-FR").format(current)} €
                      </span>
                      <span>
                        {new Intl.NumberFormat("fr-FR").format(
                          obj.targetAmount
                        )}{" "}
                        €
                      </span>
                    </div>
                    {/* Détail des sources liées */}
                    {obj.linkedIds && obj.linkedIds.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-800/50 flex flex-wrap gap-2">
                        {obj.linkedIds.map((id) => {
                          const d = getLinkDetails(id);
                          return (
                            <div
                              key={id}
                              className="text-[10px] bg-black/20 px-2 py-0.5 rounded border border-gray-700/50 flex gap-1"
                            >
                              <span>
                                {d.type === "envelope" ? "📦" : "📄"} {d.name}
                              </span>
                              <span className="text-blue-400 font-bold">
                                {new Intl.NumberFormat("fr-FR", {
                                  notation: "compact",
                                }).format(d.value)}
                                €
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* AUDIT */}
          <Card className="max-h-[300px] overflow-y-auto custom-scrollbar bg-[#161b26]">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-purple-400 text-sm uppercase border-b border-gray-800 pb-2">
              <BrainCircuit size={18} /> Analyse
            </h3>
            <div className="space-y-3">
              {stats.auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 flex gap-3 ${
                    log.type === "danger"
                      ? "bg-red-500/10 border-l-red-500"
                      : log.type === "warning"
                      ? "bg-orange-500/10 border-l-orange-500"
                      : log.type === "info"
                      ? "bg-blue-500/10 border-l-blue-500"
                      : "bg-green-500/10 border-l-green-500"
                  }`}
                >
                  <div className="mt-0.5">
                    {log.type === "danger" ? (
                      <XCircle className="text-red-500" size={16} />
                    ) : log.type === "warning" ? (
                      <AlertTriangle className="text-orange-500" size={16} />
                    ) : log.type === "info" ? (
                      <Lightbulb className="text-blue-500" size={16} />
                    ) : (
                      <CheckCircle className="text-green-500" size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-xs uppercase ${
                        log.type === "danger"
                          ? "text-red-400"
                          : log.type === "warning"
                          ? "text-orange-400"
                          : log.type === "info"
                          ? "text-blue-400"
                          : "text-green-400"
                      }`}
                    >
                      {log.title}
                    </h4>
                    <p className="text-sm text-gray-300 mt-1">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
