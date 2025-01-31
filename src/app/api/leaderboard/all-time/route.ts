import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        scores: {
          some: {
            won: true
          }
        }
      },
      select: {
        username: true,
        totalScore: true,
        totalGames: true,
        gamesWon: true,
        currentStreak: true,
        _count: {
          select: {
            scores: true
          }
        }
      },
      orderBy: [
        { totalScore: 'desc' },
        { gamesWon: 'desc' },
      ],
      take: 100
    });

    const leaderboardData = users.map(user => ({
      username: user.username || 'Anonymous Player',
      score: user.totalScore || 0,
      gamesPlayed: user.totalGames || 0,
      gamesWon: user.gamesWon || 0,
      currentStreak: user.currentStreak || 0,
    }));

    return new NextResponse(JSON.stringify(leaderboardData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
  } catch (error) {
    console.error('Error fetching all-time leaderboard:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch leaderboard' }), 
      { 
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
      }
    );
  }
}
