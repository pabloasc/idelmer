import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';

// Create a single PrismaClient instance for reuse
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Get today's date in UTC-3 (America/Sao_Paulo timezone)
    const now = new Date();
    const today = startOfDay(now);
    console.log('Searching for word on date:', today.toISOString());

    // Find today's word with explicit date comparison
    const dailyWord = await prisma.dailyWord.findFirst({
      where: {
        date: {
          equals: today.toISOString()
        }
      },
      select: {
        id: true,
        word: true,
        date: true
      }
    });

    console.log('Database query result:', dailyWord);

    if (!dailyWord) {
      console.error('No word found for date:', today.toISOString());
      return NextResponse.json(
        { error: `No word found for today ${today}` },
        { status: 404 }
      );
    }

    // Validate word before returning
    if (!dailyWord.word || typeof dailyWord.word !== 'string') {
      console.error('Invalid word data:', dailyWord);
      return NextResponse.json(
        { error: 'Invalid word data' },
        { status: 500 }
      );
    }

    // If no userId is provided, return just the word
    if (!userId) {
      console.log('Successfully found word for date:', today.toISOString());
      return NextResponse.json({ 
        id: dailyWord.id,
        word: dailyWord.word,
        date: dailyWord.date 
      });
    }

    // Get user's score for this word if it exists
    const userScore = await prisma.score.findFirst({
      where: {
        userId,
        wordId: dailyWord.id
      },
      select: {
        score: true
      }
    });

    console.log('Successfully found word and score for date:', today.toISOString());
    return NextResponse.json({ 
      id: dailyWord.id,
      word: dailyWord.word,
      date: dailyWord.date,
      userScore: userScore || undefined
    });

  } catch (error) {
    // Log detailed error information
    console.error('Error in daily word API:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });

    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Database timeout. Please try again.' },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch daily word' },
      { status: 500 }
    );
  } finally {
    // Always disconnect from the database
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}
