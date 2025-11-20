"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- 1. RÉCUPÉRER TOUTES LES DONNÉES ---
export async function getUserData() {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();

  if (!userId) return null;

  const envelopes = await prisma.envelope.findMany({ where: { userId } });
  const assets = await prisma.asset.findMany({ where: { userId } });
  const liabilities = await prisma.liability.findMany({ where: { userId } });
  const flows = await prisma.flowItem.findMany({ where: { userId } });
  const objectives = await prisma.objective.findMany({ where: { userId } });

  return {
    envelopes,
    assets,
    liabilities,
    incomes: flows.filter((f) => f.type === "income"),
    expenses: flows.filter((f) => f.type === "expense"),
    objectives,
  };
}

// --- 2. ACTIONS D'AJOUT ---

export async function addEnvelopeAction(
  name: string,
  type: string,
  yieldRate: number
) {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await prisma.envelope.create({
    data: { userId, name, type, yield: yieldRate },
  });
}

export async function addAssetAction(data: any) {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await prisma.asset.create({
    data: { ...data, userId },
  });
}

export async function addLiabilityAction(data: any) {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await prisma.liability.create({
    data: { ...data, userId },
  });
}

export async function addFlowAction(
  type: "income" | "expense",
  name: string,
  amount: number,
  group: string
) {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await prisma.flowItem.create({
    data: { userId, type, name, amount, group },
  });
}

export async function addObjectiveAction(
  name: string,
  targetAmount: number,
  linkedIds: string[]
) {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await prisma.objective.create({
    data: { userId, name, targetAmount, linkedIds },
  });
}

// --- 3. ACTIONS DE SUPPRESSION ---
export async function deleteItemAction(
  table: "asset" | "envelope" | "liability" | "flowItem" | "objective",
  id: string
) {
  // CORRECTION ICI : ajout de 'await'
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // @ts-ignore - Prisma dynamic mapping hack for brevity
  return await prisma[table].delete({
    where: { id, userId },
  });
}
