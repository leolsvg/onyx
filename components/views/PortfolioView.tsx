import { Card } from "@/components/ui/Card";
import { ENVELOPE_PRESETS, POPULAR_ASSETS } from "@/lib/constants";
import { Asset, Envelope, EnvelopeType } from "@/lib/types";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  envelopes: Envelope[];
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addEnvelope: (name: string, type: EnvelopeType) => void;
  addAsset: (asset: Asset) => void;
  // Pour les dettes... (simplifié ici, tu pourrais créer un composant DebtView séparé)
}

export default function PortfolioView({
  envelopes,
  assets,
  setAssets,
  addEnvelope,
  addAsset,
}: Props) {
  // Local State pour les Inputs UI
  const [isAddingEnvelope, setIsAddingEnvelope] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");
  const [newEnvType, setNewEnvType] = useState<EnvelopeType>("CTO");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [amountInput, setAmountInput] = useState("");
  const [buyPriceInput, setBuyPriceInput] = useState("");
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState("");

  // Search Logic
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const localMatches = POPULAR_ASSETS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(localMatches);
  }, [searchQuery]);

  const handleAddEnv = () => {
    addEnvelope(newEnvName, newEnvType);
    setIsAddingEnvelope(false);
    setNewEnvName("");
  };

  const handleAddAsset = () => {
    if (!selectedItem || !selectedEnvelopeId) return;
    const newAsset: Asset = {
      id: Date.now().toString(),
      envelopeId: selectedEnvelopeId,
      name: selectedItem.name,
      category: selectedItem.category,
      amount: parseFloat(amountInput),
      buyPrice: parseFloat(buyPriceInput) || selectedItem.price,
      unitPrice: selectedItem.price,
    };
    addAsset(newAsset);
    setSelectedItem(null);
    setAmountInput("");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
      {/* Enveloppes Slider */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => setIsAddingEnvelope(!isAddingEnvelope)}
          className="min-w-[160px] h-[100px] border border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all shrink-0"
        >
          <Plus size={24} className="mb-1" />
          <span className="text-sm font-bold">Ajouter Enveloppe</span>
        </button>
        {envelopes.map((env) => {
          const envTotal = assets
            .filter((a) => a.envelopeId === env.id)
            .reduce((acc, a) => acc + a.amount * a.unitPrice, 0);
          const preset = ENVELOPE_PRESETS[env.type];
          return (
            <div
              key={env.id}
              className="min-w-[200px] h-[100px] bg-[#161b26] border border-gray-800 rounded-xl p-4 flex flex-col justify-between shrink-0"
            >
              <div className="flex justify-between items-start">
                <div className="text-gray-400">
                  {preset.icon && <preset.icon size={18} />}
                </div>
                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-800 rounded">
                  {preset.category}
                </span>
              </div>
              <div>
                <div className="font-bold text-white truncate">{env.name}</div>
                <div className="text-sm text-gray-400">
                  {new Intl.NumberFormat("fr-FR", {
                    notation: "compact",
                  }).format(envTotal)}{" "}
                  €
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddingEnvelope && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <h3 className="font-bold mb-3 text-sm uppercase text-blue-400">
            Configuration Enveloppe
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Nom (ex: Boursorama PEA)"
              className="bg-black/30 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
            />
            <select
              className="bg-black/30 border border-gray-700 rounded-lg p-2 text-white outline-none"
              value={newEnvType}
              onChange={(e) => setNewEnvType(e.target.value as EnvelopeType)}
            >
              {Object.entries(ENVELOPE_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddEnv}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 font-bold"
            >
              Créer
            </button>
          </div>
        </Card>
      )}

      {/* Ajout Actif */}
      <Card className="border-t-2 border-t-blue-500">
        <h3 className="font-bold mb-4 text-sm uppercase text-gray-400">
          Ajouter un actif dans une enveloppe
        </h3>
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
          <div className="relative flex-1 w-full">
            <div className="flex items-center bg-black/30 border border-gray-700 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
              <Search className="text-gray-500 mr-2" size={18} />
              <input
                type="text"
                placeholder="Rechercher (Solana, S&P 500, Rolex...)"
                className="bg-transparent w-full outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-[#1a1f2e] border border-gray-700 shadow-xl z-50 max-h-60 overflow-y-auto rounded-b-lg">
                {searchResults.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedItem(r);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="p-2 hover:bg-blue-600/20 cursor-pointer flex justify-between text-sm border-b border-gray-800 items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{r.name}</span>
                      <span className="text-xs text-gray-500">{r.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">
                        {r.category}
                      </span>
                      <div className="text-xs text-blue-400">{r.price} €</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedItem && (
            <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto animate-in fade-in">
              <div className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                {selectedItem.name}{" "}
                <button onClick={() => setSelectedItem(null)}>
                  <X size={14} />
                </button>
              </div>
              <select
                className="bg-black/30 border border-gray-700 rounded-lg p-2 text-sm outline-none"
                value={selectedEnvelopeId}
                onChange={(e) => setSelectedEnvelopeId(e.target.value)}
              >
                <option value="">Choisir l'enveloppe cible...</option>
                {envelopes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantité"
                className="bg-black/30 border border-gray-700 rounded-lg p-2 w-24 text-sm outline-none"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
              <input
                type="number"
                placeholder="PRU"
                className="bg-black/30 border border-gray-700 rounded-lg p-2 w-24 text-sm outline-none"
                value={buyPriceInput}
                onChange={(e) => setBuyPriceInput(e.target.value)}
              />
              <button
                onClick={handleAddAsset}
                disabled={!selectedEnvelopeId}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
              >
                Valider
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Listing */}
      <div className="grid grid-cols-1 gap-4">
        {envelopes.map((env) => {
          const envAssets = assets.filter((a) => a.envelopeId === env.id);
          if (envAssets.length === 0) return null;
          const total = envAssets.reduce(
            (acc, a) => acc + a.amount * a.unitPrice,
            0
          );
          const preset = ENVELOPE_PRESETS[env.type];

          return (
            <div
              key={env.id}
              className="bg-[#161b26] rounded-xl border border-gray-800 overflow-hidden"
            >
              <div className="p-4 bg-gray-800/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg text-gray-300">
                    {preset.icon && <preset.icon size={18} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{env.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      {preset.category}
                    </span>
                  </div>
                </div>
                <div className="font-bold">{total.toLocaleString()} €</div>
              </div>
              <table className="w-full text-left text-sm text-gray-400">
                <tbody className="divide-y divide-gray-800/50">
                  {envAssets.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 pl-4 text-white font-medium">
                        {a.name}{" "}
                        <span className="text-gray-600 text-xs ml-1">
                          x{a.amount}
                        </span>
                      </td>
                      <td className="p-3 text-right text-xs">
                        {a.unitPrice.toLocaleString()} €
                      </td>
                      <td className="p-3 text-right font-bold text-white">
                        {(a.amount * a.unitPrice).toLocaleString()} €
                      </td>
                      <td className="p-3 text-right pr-4">
                        <button
                          onClick={() =>
                            setAssets(assets.filter((x) => x.id !== a.id))
                          }
                          className="text-gray-600 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
