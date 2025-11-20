import { Card } from "@/components/ui/Card";
import { FlowItem, Liability } from "@/lib/types";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";

interface Props {
  incomes: FlowItem[];
  setIncomes: (items: FlowItem[]) => void;
  expenses: FlowItem[];
  setExpenses: (items: FlowItem[]) => void;
  liabilities: Liability[];
}

export default function CashflowView({
  incomes,
  setIncomes,
  expenses,
  setExpenses,
  liabilities,
}: Props) {
  // Local Inputs
  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeAmount, setNewIncomeAmount] = useState("");
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseGroup, setNewExpenseGroup] = useState("Logement");

  const addIncome = () => {
    if (!newIncomeName || !newIncomeAmount) return;
    setIncomes([
      ...incomes,
      {
        id: Date.now().toString(),
        name: newIncomeName,
        amount: parseFloat(newIncomeAmount),
        group: "Revenus",
      },
    ]);
    setNewIncomeName("");
    setNewIncomeAmount("");
  };
  const addExpense = () => {
    if (!newExpenseName || !newExpenseAmount || !newExpenseGroup) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name: newExpenseName,
        amount: parseFloat(newExpenseAmount),
        group: newExpenseGroup,
      },
    ]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  // Sankey Logic
  const expenseGroups = Array.from(new Set(expenses.map((e) => e.group)));
  const incomeNodes = incomes.map((i) => ({ name: i.name }));
  const totalNode = { name: "Revenus Totaux" };
  const groupNodes = expenseGroups.map((g) => ({ name: g || "Autre" }));
  const debtsNode = { name: "Dettes / Crédits" };
  const savingsNode = { name: "Épargne Restante" };

  const nodes = [
    ...incomeNodes,
    totalNode,
    ...groupNodes,
    debtsNode,
    savingsNode,
  ];

  const totalIncomeVal = incomes.reduce((a, b) => a + b.amount, 0);
  const totalDebtVal = liabilities.reduce((a, b) => a + b.monthlyPayment, 0);
  const totalExpenseVal = expenses.reduce((a, b) => a + b.amount, 0);
  const savingsVal = Math.max(
    0,
    totalIncomeVal - totalExpenseVal - totalDebtVal
  );

  const links: any[] = [];
  incomes.forEach((inc, idx) =>
    links.push({ source: idx, target: incomes.length, value: inc.amount })
  );
  expenseGroups.forEach((grp, idx) => {
    const grpAmount = expenses
      .filter((e) => e.group === grp)
      .reduce((a, b) => a + b.amount, 0);
    if (grpAmount > 0)
      links.push({
        source: incomes.length,
        target: incomes.length + 1 + idx,
        value: grpAmount,
      });
  });
  if (totalDebtVal > 0)
    links.push({
      source: incomes.length,
      target: nodes.length - 2,
      value: totalDebtVal,
    });
  if (savingsVal > 0)
    links.push({
      source: incomes.length,
      target: nodes.length - 1,
      value: savingsVal,
    });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* COLONNE REVENUS */}
        <Card className="md:col-span-1">
          <h3 className="font-bold mb-4 text-sm uppercase text-green-400">
            Entrées (Revenus)
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Source"
              className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-full"
              value={newIncomeName}
              onChange={(e) => setNewIncomeName(e.target.value)}
            />
            <input
              type="number"
              placeholder="€"
              className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-20"
              value={newIncomeAmount}
              onChange={(e) => setNewIncomeAmount(e.target.value)}
            />
            <button
              onClick={addIncome}
              className="bg-green-600 text-white rounded px-3"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {incomes.map((i) => (
              <div
                key={i.id}
                className="flex justify-between text-sm border-b border-gray-800 pb-1"
              >
                <span>{i.name}</span>{" "}
                <span className="font-bold text-green-400">+{i.amount}€</span>
              </div>
            ))}
          </div>
        </Card>

        {/* COLONNE DEPENSES GROUPEES */}
        <Card className="md:col-span-1">
          <h3 className="font-bold mb-4 text-sm uppercase text-red-400">
            Sorties (Groupes)
          </h3>
          <div className="flex flex-col gap-2 mb-4 p-2 bg-gray-800/30 rounded">
            <input
              type="text"
              placeholder="Nom (ex: Loyer)"
              className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-full"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Groupe (ex: Logement)"
                className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-full"
                value={newExpenseGroup}
                onChange={(e) => setNewExpenseGroup(e.target.value)}
              />
              <input
                type="number"
                placeholder="€"
                className="bg-black/30 border border-gray-700 rounded p-2 text-xs w-20"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
              />
              <button
                onClick={addExpense}
                className="bg-red-600 text-white rounded px-3"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {expenseGroups.map((grp) => (
              <div key={grp} className="bg-black/20 p-2 rounded">
                <div className="flex justify-between text-xs font-bold text-gray-300 mb-2 uppercase border-b border-gray-700 pb-1">
                  <span className="flex items-center gap-1">
                    <FolderOpen size={10} /> {grp}
                  </span>
                </div>
                {expenses
                  .filter((e) => e.group === grp)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="flex justify-between text-sm pl-2 mb-1"
                    >
                      <span>{e.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">-{e.amount}€</span>
                        <button
                          onClick={() =>
                            setExpenses(expenses.filter((x) => x.id !== e.id))
                          }
                        >
                          <Trash2
                            size={10}
                            className="text-gray-600 hover:text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Card>

        {/* COLONNE RESULTAT */}
        <Card className="md:col-span-1 flex flex-col justify-center bg-blue-900/10 border-blue-500/30">
          <div className="text-center">
            <div className="text-xs uppercase text-gray-400 mb-1">
              Capacité d'épargne
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {savingsVal.toLocaleString()} €
            </div>
          </div>
        </Card>
      </div>

      {/* SANKEY CHART */}
      <Card className="h-[500px] bg-[#0f1219] border-gray-800 overflow-visible relative">
        <div className="absolute top-4 left-4 text-xs text-gray-500 uppercase font-bold z-10">
          Flux Financiers Groupés
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={{ nodes, links }}
            node={{ width: 10 }}
            nodePadding={50}
            margin={{ left: 10, right: 100, top: 40, bottom: 20 }}
            link={{ stroke: "#3b82f6", strokeOpacity: 0.2 }}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: "#11141d",
                borderColor: "#374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </Sankey>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
