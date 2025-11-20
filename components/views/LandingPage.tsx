// components/views/LandingPage.tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  BrainCircuit,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-blue-500/30">
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-gray-800/50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            F
          </div>
          <span className="tracking-tight">FinaryKiller</span>
        </div>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Connexion
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
              Commencer
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center relative">
        {/* Gradient Background Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          La v1 est disponible
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
          Gérez votre patrimoine <br /> comme un expert.
        </h1>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Arrêtez de naviguer à vue. Suivez vos actifs, analysez vos flux
          financiers (Sankey), simulez votre avenir et optimisez votre
          fiscalité. Le tout dans une seule app.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
              Créer un compte gratuit <ArrowRight size={18} />
            </button>
          </SignUpButton>
          <a
            href="#features"
            className="text-gray-400 hover:text-white text-sm font-medium"
          >
            Voir les fonctionnalités
          </a>
        </div>
      </div>

      {/* DASHBOARD PREVIEW (Fake UI) */}
      <div className="max-w-6xl mx-auto px-6 mb-32">
        <div className="rounded-xl border border-gray-800 bg-[#11141d]/50 p-2 shadow-2xl backdrop-blur-sm relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <img
            src="https://i.imgur.com/Xv6QyH6.png" // Placeholder d'interface, tu pourras mettre un screen de ton app
            alt="Interface FinaryKiller"
            className="rounded-lg w-full h-auto opacity-90"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 50%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0E14] to-transparent flex items-end justify-center pb-10">
            <span className="text-gray-500 text-sm">
              Données chiffrées & sécurisées
            </span>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: PieChart,
              title: "Agrégation Complète",
              desc: "Banques, Cryptos, Immo, Montres... Tout votre patrimoine réuni au même endroit, mis à jour en temps réel.",
            },
            {
              icon: BrainCircuit,
              title: "IA & Conseils",
              desc: "Un audit automatique de votre portefeuille pour détecter les frais cachés et optimiser votre fiscalité (PEA vs CTO).",
            },
            {
              icon: TrendingUp,
              title: "Projections Futures",
              desc: "Simulez votre enrichissement sur 10, 20 ou 30 ans avec des scénarios de vie (achat immo, études...).",
            },
            {
              icon: Wallet,
              title: "Flux Sankey",
              desc: "Visualisez exactement où part votre argent chaque mois avec des graphiques de flux dynamiques.",
            },
            {
              icon: ShieldCheck,
              title: "Privacy First",
              desc: "Vos données ne sont jamais vendues. Architecture sécurisée et chiffrée.",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#11141d] border border-gray-800 hover:border-blue-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <feat.icon className="text-blue-400" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">
                {feat.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-12 text-center">
        <div className="text-gray-500 text-sm mb-4">
          © 2024 FinaryKiller. Construit pour l'indépendance financière.
        </div>
      </footer>
    </div>
  );
}
