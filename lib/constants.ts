// app/lib/constants.ts
import {
  Briefcase,
  Building2,
  CheckCircle,
  Landmark,
  PiggyBank,
  Wallet,
  Watch,
} from "lucide-react";

export const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#ef4444",
  "#14b8a6",
];

export const ENVELOPE_PRESETS = {
  PEA: {
    name: "PEA",
    taxRate: 0.172,
    icon: CheckCircle,
    desc: "Actions FR/EU (17.2%)",
    category: "Financial",
  },
  CTO: {
    name: "Compte Titres (CTO)",
    taxRate: 0.3,
    icon: Briefcase,
    desc: "Actions Monde (Flat Tax 30%)",
    category: "Financial",
  },
  CRYPTO: {
    name: "Wallet Crypto",
    taxRate: 0.3,
    icon: Wallet,
    desc: "Flat Tax 30% sur plus-value",
    category: "Crypto",
  },
  LIVRET: {
    name: "Livret (A/LDDS)",
    taxRate: 0,
    icon: PiggyBank,
    desc: "Net d'impôt (0%)",
    category: "Banking",
    defaultYield: 3.0,
  },
  IMMO: {
    name: "Immobilier",
    taxRate: 0.3,
    icon: Building2,
    desc: "Revenus fonciers / LMNP",
    category: "RealEstate",
  },
  PHYSICAL: {
    name: "Biens Physiques",
    taxRate: 0.065,
    icon: Watch,
    desc: "Taxe forfaitaire métaux (TMP)",
    category: "Physical",
  },
  BANK: {
    name: "Compte Courant",
    taxRate: 0,
    icon: Landmark,
    desc: "Liquidités",
    category: "Banking",
  },
};

export const POPULAR_ASSETS = [
  {
    id: "cw8",
    symbol: "CW8",
    name: "Amundi MSCI World",
    category: "Actions",
    price: 485.2,
  },
  {
    id: "sp500-vusa",
    symbol: "VUSA",
    name: "Vanguard S&P 500",
    category: "Actions",
    price: 88.5,
  },
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    category: "Crypto",
    price: 62000,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    category: "Crypto",
    price: 3400,
  },
  { id: "sol", symbol: "SOL", name: "Solana", category: "Crypto", price: 145 },
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple",
    category: "Actions",
    price: 175.0,
  },
  {
    id: "immo-paris",
    symbol: "APT",
    name: "Appartement Paris",
    category: "Immobilier",
    price: 1,
  },
  {
    id: "rolex",
    symbol: "SUB",
    name: "Rolex Submariner",
    category: "Physique",
    price: 12500,
  },
  {
    id: "gold",
    symbol: "XAU",
    name: "Or (Lingot)",
    category: "Physique",
    price: 70000,
  },
  { id: "eur", symbol: "EUR", name: "Euro", category: "Cash", price: 1 },
];
