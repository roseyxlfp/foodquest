import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { money: "desc" },
      take: 10,
    });
    return NextResponse.json({ scores });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ scores: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const playerName = String(body.playerName ?? "").slice(0, 30).trim() || "Anon";
    const money = Math.max(0, Math.floor(Number(body.money) || 0));
    const correct = Math.max(0, Math.floor(Number(body.correct) || 0));
    const total = Math.max(0, Math.floor(Number(body.total) || 0));
    const plants = Math.max(0, Math.floor(Number(body.plants) || 0));
    const mascots = Math.max(0, Math.floor(Number(body.mascots) || 0));

    const score = await prisma.score.create({
      data: { playerName, money, correct, total, plants, mascots },
    });
    return NextResponse.json({ score });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
