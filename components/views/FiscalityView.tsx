import { Card } from "@/components/ui/Card";
import { Asset, Envelope } from "@/lib/types";
import { Calendar, FileText } from "lucide-react";

interface Props {
  assets: Asset[];
  envelopes: Envelope[];
}

export default function FiscalityView({ assets, envelopes }: Props) {
  const hasCrypto = assets.some((a) => a.category === "Crypto");
  const hasForeign = envelopes.some(
    (e) =>
      e.name.toLowerCase().includes("ledger") ||
      e.name.toLowerCase().includes("revolut") ||
      e.name.toLowerCase().includes("binance")
  );
  const hasPhysical = assets.some((a) => a.category === "Physique");

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FileText className="text-yellow-500" /> Assistant de Déclaration &
        Fiscalité
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {hasForeign && (
            <Card className="border-l-4 border-l-orange-500">
              <h4 className="font-bold text-orange-500 mb-1 text-sm uppercase">
                Formulaire 3916 (Comptes Étrangers)
              </h4>
              <p className="text-sm text-gray-400">
                Déclarez vos comptes étrangers (Binance, Revolut...) même vides.
              </p>
            </Card>
          )}
          {hasCrypto && (
            <Card className="border-l-4 border-l-purple-500">
              <h4 className="font-bold text-purple-500 mb-1 text-sm uppercase">
                Formulaire 2086 (Crypto)
              </h4>
              <p className="text-sm text-gray-400">
                Les plus-values en Fiat sont taxables (Flat Tax 30%).
              </p>
            </Card>
          )}
          {hasPhysical && (
            <Card className="border-l-4 border-l-yellow-500">
              <h4 className="font-bold text-yellow-500 mb-1 text-sm uppercase">
                Taxe Métaux (TMP)
              </h4>
              <p className="text-sm text-gray-400">
                Or/Bijoux 5000€ : Taxe Forfaitaire (11.5%) ou Plus-values
                réelles.
              </p>
            </Card>
          )}
          <Card className="border-l-4 border-l-blue-500">
            <h4 className="font-bold text-blue-500 mb-1 text-sm uppercase">
              Flat Tax vs Barème
            </h4>
            <p className="text-sm text-gray-400">
              Case 2OP : Cochez si votre TMI est faible pour éviter les 30%.
            </p>
          </Card>
        </div>

        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase">
            <Calendar size={18} /> Calendrier Fiscal
          </h3>
          <div className="relative border-l border-gray-700 ml-3 space-y-8 pl-6 py-2">
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-600 rounded-full border-2 border-[#11141d]"></div>
              <div className="text-gray-500 text-xs font-bold">AVRIL</div>
              <div className="text-white text-sm font-bold">
                Ouverture déclaration
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] border-2 border-[#11141d]"></div>
              <div className="text-blue-500 text-xs font-bold">MAI / JUIN</div>
              <div className="text-white text-sm font-bold">Date limite</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-600 rounded-full border-2 border-[#11141d]"></div>
              <div className="text-gray-500 text-xs font-bold">SEPTEMBRE</div>
              <div className="text-white text-sm font-bold">
                Avis d'imposition
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
