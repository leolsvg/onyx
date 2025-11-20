// app/lib/types.ts

export type EnvelopeType =
  | "PEA"
  | "CTO"
  | "CRYPTO"
  | "LIVRET"
  | "IMMO"
  | "PHYSICAL"
  | "BANK";

export type Envelope = {
  id: string;
  name: string;
  type: EnvelopeType;
  yield?: number;
};

export type Liability = {
  id: string;
  name: string;
  amountRemaining: number;
  monthlyPayment: number;
  rate: number;
  startDate?: string;
  endDate: string;
};

export type Asset = {
  id: string;
  envelopeId: string;
  name: string;
  category: string;
  amount: number;
  buyPrice: number;
  unitPrice: number;
};

export type FlowItem = {
  id: string;
  name: string;
  amount: number;
  group?: string;
};

export type AuditLog = {
  id: string;
  type: "success" | "warning" | "danger";
  title: string;
  message: string;
  impact: number; // Impact sur le score (ex: -5 pts)
};

export type Objective = {
  id: string;
  name: string;
  targetAmount: number;
  linkedIds: string[]; // Liste des IDs d'enveloppes ou d'actifs liés
};

// lib/types.ts (Ajoute ceci à la fin)

export type SimulationType = "deposit" | "withdrawal"; // Apport ou Retrait

export type LifeEvent = {
  id: string;
  name: string;
  yearOffset: number; // Dans combien d'années ? (ex: 3 ans)
  amount: number;
  type: SimulationType;
};

export type SimulationParams = {
  monthlySavings: number;
  duration: number;
  expectedReturn: number; // % annuel
  inflation: number; // % annuel
};

export type GlobalStats = {
  grossAssets: number;
  totalDebt: number;
  potentialTax: number;
  netWealth: number;
  annualInterest: number;
  liquidCash: number;
  runwayMonths: number;
  debtRatio: number;
  savingsCapacity: number;
  totalMonthlyIncome: number;
  totalMonthlyOut: number;
  // SCORE EXPERT
  finaryScore: number;
  auditLogs: AuditLog[]; // La liste détaillée des analyses
};
