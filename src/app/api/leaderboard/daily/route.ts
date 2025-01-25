import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get today's word
    const todayWord = await prisma.dailyWord.findFirst({
      where: {
        date: today
      },
      select: {
        id: true,
        word: true,
        date: true
      }
    });

    if (!todayWord) {
      console.log('No daily word found for today:', today.toISOString());
      return NextResponse.json([]);
    }

    console.log('Found daily word:', {
      id: todayWord.id,
      word: todayWord.word,
      date: todayWord.date,
      queryDate: today
    });

    // Get all scores for this word
    const dailyScores = await prisma.score.findMany({
      where: {
        wordId: todayWord.id,
        won: true,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        { score: 'desc' },
        { attempts: 'asc' },
        { timeTaken: 'asc' },
      ],
    });

    console.log('Found scores:', {
      count: dailyScores.length,
      scores: dailyScores.map(s => ({
        wordId: s.wordId,
        score: s.score,
        username: s.user?.username
      }))
    });

    const leaderboardData = dailyScores.map(score => ({
      username: score.user?.username || 'Anonymous Player',
      score: score.score,
      attempts: score.attempts,
      timeTaken: score.timeTaken || 0,
      date: score.createdAt.toISOString()
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching daily leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
} 