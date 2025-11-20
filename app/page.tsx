"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  ArrowRightLeft,
  FileText,
  LayoutDashboard,
  Loader2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Imports Server Actions
import {
  addAssetAction,
  addEnvelopeAction,
  addFlowAction,
  addLiabilityAction,
  addObjectiveAction,
  deleteItemAction,
  getUserData,
} from "@/app/actions";

// Imports Vues
import CashflowView from "@/components/views/CashflowView";
import DashboardView from "@/components/views/DashboardView";
import FiscalityView from "@/components/views/FiscalityView";
import LandingPage from "@/components/views/LandingPage";
import PortfolioView from "@/components/views/PortfolioView";
import ProjectionView from "@/components/views/ProjectionView";

import { ENVELOPE_PRESETS } from "@/lib/constants";
import {
  Asset,
  AuditLog,
  Envelope,
  EnvelopeType,
  FlowItem,
  Liability,
  Objective,
} from "@/lib/types";

export default function FinaryKillerApp() {
  const { user, isLoaded } = useUser();
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "portfolio" | "cashflow" | "fiscality" | "projection"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data State
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [incomes, setIncomes] = useState<FlowItem[]>([]);
  const [expenses, setExpenses] = useState<FlowItem[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);

  // --- 1. CHARGEMENT DES DONNÉES (Seulement si connecté) ---
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const data = await getUserData();
        if (data) {
          // @ts-ignore
          setEnvelopes(data.envelopes);
          // @ts-ignore
          setAssets(data.assets);
          // @ts-ignore
          setLiabilities(data.liabilities);
          // @ts-ignore
          setIncomes(data.incomes);
          // @ts-ignore
          setExpenses(data.expenses);
          // @ts-ignore
          setObjectives(data.objectives);
        }
      } catch (error) {
        console.error("Erreur chargement données", error);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [isLoaded, user]);

  // --- 2. FONCTIONS DE MODIFICATION ---
  const addEnvelope = async (name: string, type: EnvelopeType) => {
    // CORRECTION ICI : on force le type avec 'as any' pour éviter l'erreur TypeScript
    const preset = ENVELOPE_PRESETS[type] as any;

    const tempId = Date.now().toString();
    const newEnv = { id: tempId, name, type, yield: preset.defaultYield || 0 };

    setEnvelopes([...envelopes, newEnv]);

    try {
      const created = await addEnvelopeAction(
        name,
        type,
        preset.defaultYield || 0
      );
      setEnvelopes((prev) =>
        prev.map((e) => (e.id === tempId ? { ...e, id: created.id } : e))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const addAsset = async (asset: Asset) => {
    setAssets([...assets, asset]);
    const { id, ...data } = asset;
    const created = await addAssetAction(data);
    setAssets((prev) =>
      prev.map((a) => (a.id === asset.id ? { ...a, id: created.id } : a))
    );
  };

  const addLiability = async (l: Liability) => {
    setLiabilities([...liabilities, l]);
    const { id, ...data } = l;
    await addLiabilityAction(data);
  };

  const addIncomeFlow = async (item: FlowItem) => {
    setIncomes([...incomes, item]);
    await addFlowAction("income", item.name, item.amount, item.group || "");
  };

  const addExpenseFlow = async (item: FlowItem) => {
    setExpenses([...expenses, item]);
    await addFlowAction("expense", item.name, item.amount, item.group || "");
  };

  const addObjective = async (
    name: string,
    target: number,
    linkedIds: string[]
  ) => {
    const tempObj = {
      id: Date.now().toString(),
      name,
      targetAmount: target,
      linkedIds,
    };
    setObjectives([...objectives, tempObj]);
    await addObjectiveAction(name, target, linkedIds);
  };

  const deleteItem = async (type: string, id: string) => {
    if (type === "asset") setAssets(assets.filter((x) => x.id !== id));
    if (type === "objective")
      setObjectives(objectives.filter((x) => x.id !== id));
    // @ts-ignore
    await deleteItemAction(type, id);
  };

  // --- MOTEUR CALCUL ---
  const stats = useMemo(() => {
    let grossAssets = 0;
    let potentialTax = 0;
    let annualInterest = 0;
    let liquidCash = 0;
    let totalPEA = 0;
    let totalLivrets = 0;
    const assetNames: string[] = [];
    const allocation: Record<string, number> = {};

    assets.forEach((a) => {
      const env = envelopes.find((e) => e.id === a.envelopeId);
      const val = a.amount * a.unitPrice;
      const gain = val - a.amount * a.buyPrice;
      grossAssets += val;
      assetNames.push(a.name.toLowerCase());
      allocation[a.category] = (allocation[a.category] || 0) + val;

      if (env?.type === "PEA") totalPEA += val;
      if (env?.type === "LIVRET") totalLivrets += val;

      // Correction accès typage preset
      const envType = env?.type as EnvelopeType | undefined;
      if (envType && gain > 0)
        potentialTax += gain * ENVELOPE_PRESETS[envType].taxRate;

      if (env && env.type === "LIVRET" && env.yield)
        annualInterest += val * (env.yield / 100);
      if (
        env &&
        (env.type === "LIVRET" || env.type === "BANK" || a.category === "Cash")
      )
        liquidCash += val;
    });

    const totalDebt = liabilities.reduce(
      (acc, l) => acc + l.amountRemaining,
      0
    );
    const netWealth = grossAssets - totalDebt - potentialTax;

    const totalMonthlyIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
    const totalMonthlyDebtPayment = liabilities.reduce(
      (acc, l) => acc + l.monthlyPayment,
      0
    );
    const totalMonthlyFixedExpenses = expenses.reduce(
      (acc, e) => acc + e.amount,
      0
    );
    const totalMonthlyOut = totalMonthlyFixedExpenses + totalMonthlyDebtPayment;
    const debtRatio =
      totalMonthlyIncome > 0
        ? (totalMonthlyDebtPayment / totalMonthlyIncome) * 100
        : 0;
    const savingsCapacity = totalMonthlyIncome - totalMonthlyOut;
    const runwayMonths = totalMonthlyOut > 0 ? liquidCash / totalMonthlyOut : 0;

    // Scoring V2
    let score = 100;
    const audit: AuditLog[] = [];
    const cashRatio = grossAssets > 0 ? liquidCash / grossAssets : 0;

    if (cashRatio > 0.4) {
      const penalty = cashRatio > 0.8 ? 30 : cashRatio > 0.6 ? 20 : 10;
      score -= penalty;
      audit.push({
        id: "inf",
        type: "danger",
        title: "Érosion Monétaire",
        message: `Trop de cash (${Math.round(
          cashRatio * 100
        )}%). L'inflation vous appauvrit.`,
        impact: -penalty,
      });
    }

    let maxConcentration = 0;
    let dominantAsset = "";
    Object.entries(allocation).forEach(([cat, amount]) => {
      const ratio = amount / grossAssets;
      if (ratio > maxConcentration) {
        maxConcentration = ratio;
        dominantAsset = cat;
      }
    });
    if (
      maxConcentration > 0.6 &&
      dominantAsset !== "Cash" &&
      dominantAsset !== "Livret"
    ) {
      score -= 15;
      audit.push({
        id: "conc",
        type: "warning",
        title: "Diversification",
        message: `Trop exposé à ${dominantAsset}.`,
        impact: -15,
      });
    }

    const frenchStocksInCTO = assets.filter((a) => {
      const env = envelopes.find((e) => e.id === a.envelopeId);
      const isCTO = env?.type === "CTO";
      const isFrench = [
        "lvmh",
        "total",
        "air liquide",
        "bnp",
        "sanofi",
        "cw8",
        "vinci",
        "axa",
      ].some((k) => a.name.toLowerCase().includes(k));
      return isCTO && isFrench;
    });
    if (frenchStocksInCTO.length > 0 && totalPEA < 150000) {
      score -= 10;
      audit.push({
        id: "tax",
        type: "danger",
        title: "Fiscalité",
        message: `Actions FR sur CTO alors que PEA non plein.`,
        impact: -10,
      });
    }

    if (runwayMonths < 3) {
      score -= 10;
      audit.push({
        id: "safe",
        type: "danger",
        title: "Sécurité",
        message: `Matelas < 3 mois.`,
        impact: -10,
      });
    }

    if (totalLivrets > 22950 * 2) {
      audit.push({
        id: "liv",
        type: "info",
        title: "Plafonds Livrets",
        message: `Vérifiez les plafonds légaux.`,
        impact: 0,
      });
    }

    score = Math.max(0, Math.min(100, score));

    return {
      grossAssets,
      totalDebt,
      potentialTax,
      netWealth,
      annualInterest,
      liquidCash,
      runwayMonths,
      debtRatio,
      savingsCapacity,
      totalMonthlyIncome,
      totalMonthlyOut,
      finaryScore: score,
      auditLogs: audit,
    };
  }, [assets, envelopes, liabilities, incomes, expenses]);

  // --- RENDER ---
  return (
    <>
      {/* 1. SI DÉCONNECTÉ : AFFICHER LANDING PAGE */}
      <SignedOut>
        <LandingPage />
      </SignedOut>

      {/* 2. SI CONNECTÉ : AFFICHER L'APP */}
      <SignedIn>
        {loadingData ? (
          <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-500" size={48} />
              <div className="text-sm text-gray-400 animate-pulse">
                Chargement de votre empire...
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex selection:bg-blue-500/30">
            <aside
              className={`${
                sidebarOpen ? "w-64" : "w-20"
              } bg-[#0f1219] border-r border-gray-800 transition-all hidden md:flex flex-col fixed h-full z-50`}
            >
              <div className="p-6 font-bold text-xl flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  F
                </div>
                {sidebarOpen && <span className="tracking-tight">Onyx</span>}
              </div>
              <nav className="flex-1 px-4 space-y-2 mt-6">
                {[
                  {
                    id: "dashboard",
                    icon: LayoutDashboard,
                    label: "Vue Globale",
                  },
                  { id: "portfolio", icon: Wallet, label: "Portefeuille" },
                  { id: "cashflow", icon: ArrowRightLeft, label: "Cashflow" },
                  { id: "projection", icon: TrendingUp, label: "Projections" },
                  { id: "fiscality", icon: FileText, label: "Fiscalité" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${
                      activeTab === item.id
                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} /> {sidebarOpen && item.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-800 flex items-center gap-3 justify-center">
                <UserButton afterSignOutUrl="/" />
                {sidebarOpen && (
                  <span className="text-sm font-bold truncate">
                    {user?.firstName || "Investisseur"}
                  </span>
                )}
              </div>
            </aside>

            <main
              className={`flex-1 p-4 md:p-8 transition-all ${
                sidebarOpen ? "md:ml-64" : "md:ml-20"
              } pt-8`}
            >
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold capitalize text-white tracking-tight">
                  {activeTab === "fiscality" ? "Fiscalité" : activeTab}
                </h1>
                <div className="text-right hidden md:block">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Patrimoine Net
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(stats.netWealth)}
                  </div>
                </div>
              </header>

              {/* VUES AVEC FONCTIONS DE MODIFICATION MISES A JOUR */}
              {activeTab === "dashboard" && (
                <DashboardView
                  stats={stats}
                  assets={assets}
                  envelopes={envelopes}
                  objectives={objectives}
                  addObjective={addObjective}
                  deleteObjective={(id: string) => deleteItem("objective", id)}
                />
              )}
              {activeTab === "portfolio" && (
                <PortfolioView
                  envelopes={envelopes}
                  assets={assets}
                  setAssets={setAssets}
                  addEnvelope={addEnvelope}
                  addAsset={addAsset}
                />
              )}
              {activeTab === "cashflow" && (
                <CashflowView
                  incomes={incomes}
                  setIncomes={setIncomes}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  liabilities={liabilities}
                  addIncomeParent={addIncomeFlow}
                  addExpenseParent={addExpenseFlow}
                />
              )}
              {activeTab === "projection" && <ProjectionView stats={stats} />}
              {activeTab === "fiscality" && (
                <FiscalityView assets={assets} envelopes={envelopes} />
              )}
            </main>
          </div>
        )}
      </SignedIn>
    </>
  );
}
