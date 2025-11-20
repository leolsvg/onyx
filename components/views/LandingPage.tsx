// components/views/LandingPage.tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowRightLeft,
  BrainCircuit,
  Check,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#05050A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-800 via-black to-gray-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-900/20">
              <span className="text-white font-serif italic">O</span>
            </div>
            <span>Onyx</span>
          </div>
          <div className="flex items-center gap-6">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">
                Se connecter
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2">
                Commencer <ArrowRight size={16} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-medium mb-8 hover:bg-white/10 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          L'alternative moderne aux fichiers Excel
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Votre patrimoine,
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            en haute définition.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
          Onyx agrège vos comptes bancaires, cryptos, immobilier et
          investissements en un seul tableau de bord intelligent. Analysez,
          projetez, optimisez.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              Créer mon espace gratuit
            </button>
          </SignUpButton>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Check size={16} className="text-green-500" /> Pas de carte requise
          </div>
        </div>

        {/* HERO IMAGE MOCKUP */}
        <div className="mt-20 relative group animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-xl bg-[#0B0E14] border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              </div>
              <div className="mx-auto text-xs font-mono text-gray-600">
                onyx.app/dashboard
              </div>
            </div>
            {/* Faux UI pour l'exemple (CSS Only) */}
            <div className="p-8 grid grid-cols-3 gap-6 aspect-[16/9] bg-[#05050A]">
              <div className="col-span-2 space-y-6">
                <div className="h-32 rounded-lg bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 p-6 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded bg-blue-500/20"></div>
                  <div className="h-8 w-40 bg-blue-500/20 rounded"></div>
                </div>
                <div className="h-64 rounded-lg bg-white/5 border border-white/5 p-4 flex items-end gap-2">
                  {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-600/40 rounded-t hover:bg-blue-500 transition-all"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-20 rounded-lg bg-white/5 border border-white/5"></div>
                <div className="h-20 rounded-lg bg-white/5 border border-white/5"></div>
                <div className="h-full rounded-lg bg-white/5 border border-white/5"></div>
              </div>
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-0 right-0 text-center">
              <p className="text-sm text-gray-400 font-medium">
                Interface simplifiée • Données chiffrées • Analyse temps réel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Plus qu'un simple tableau Excel.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Onyx remplace 5 outils différents. Centralisez tout, du livret A à
            vos montres de collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Agrégation */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all"></div>
            <LayoutDashboard className="text-blue-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-2">Agrégation 360°</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Connectez vos comptes bancaires, plateformes crypto (Binance,
              Ledger) et ajoutez vos actifs immobiliers. Tout est mis à jour
              automatiquement.
            </p>
            <div className="flex gap-2">
              {["PEA", "CTO", "Immo", "Crypto", "Montres"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/5 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Feature 2: IA */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <BrainCircuit className="text-purple-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-2">Coach IA</h3>
            <p className="text-gray-400 text-sm">
              Analyse votre diversification, détecte les frais cachés et
              optimise votre fiscalité (Flat Tax vs Barème).
            </p>
          </div>

          {/* Feature 3: Sankey */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-green-500/30 transition-all group relative overflow-hidden">
            <ArrowRightLeft className="text-green-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-2">Cashflow Sankey</h3>
            <p className="text-gray-400 text-sm">
              Visualisez où part chaque euro. Identifiez instantanément vos
              fuites de capital.
            </p>
          </div>

          {/* Feature 4: Projections */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group">
            <TrendingUp className="text-yellow-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-2">Projections Futures</h3>
            <p className="text-gray-400 max-w-md">
              Simulez votre patrimoine dans 10, 20 ou 30 ans. Ajoutez des
              scénarios de vie (achat résidence principale, études des enfants)
              et voyez l'impact immédiat.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECURITY SECTION --- */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold mb-6 border border-green-500/20">
              <Lock size={12} /> Sécurité Bancaire
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Vos données vous appartiennent. Point final.
            </h2>
            <ul className="space-y-4">
              {[
                "Chiffrement AES-256 de bout en bout",
                "Aucune vente de données à des tiers",
                "Connexion en lecture seule (Read-Only)",
                "Stockage sécurisé en Europe",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <Check size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <ShieldCheck size={200} className="text-white/10" />
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full -z-10"></div>

        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Prenez le contrôle de <br />
          votre avenir financier.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <button className="h-14 px-10 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
              <Zap size={20} className="fill-black" /> Commencer maintenant
            </button>
          </SignUpButton>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Gratuit. Sans engagement. Sécurisé.
        </p>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 bg-[#020205] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              O
            </div>
            <span>Onyx</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Sécurité
            </a>
            <a href="#" className="hover:text-white transition-colors">
              A propos
            </a>
          </div>
          <div className="text-xs text-gray-600">
            © 2024 Onyx Technologies. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
