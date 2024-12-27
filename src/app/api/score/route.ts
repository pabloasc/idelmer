import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, wordId, score, attempts, won, completed } = data;

    if (!userId || !wordId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const scoreRecord = await prisma.score.upsert({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
      update: {
        score,
        attempts,
        won,
        completed,
      },
      create: {
        userId,
        wordId,
        score,
        attempts,
        won,
        completed,
      },
    });

    return NextResponse.json(scoreRecord);
  } catch (error) {
    console.error('Error in score API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        highestScore: true,
        totalGames: true,
        gamesWon: true,
        scores: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            word: true,
          },
        },
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
