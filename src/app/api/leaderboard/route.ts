import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: { highestScore: 'desc' },
      take: 10,
      select: {
        email: true,
        highestScore: true,
        totalGames: true,
        gamesWon: true,
      },
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
