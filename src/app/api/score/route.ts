import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { wordId, score, attempts, won, timeTaken, hintsUsed } = await request.json();

    const newScore = await prisma.score.upsert({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId,
        },
      },
      create: {
        wordId,
        score,
        attempts,
        won,
        timeTaken,
        hintsUsed,
        userId: user.id,
      },
      update: {
        score,
        attempts,
        won,
        timeTaken,
        hintsUsed,
      },
    });

    return NextResponse.json(newScore);
  } catch (error) {
    console.error('Error in POST /api/score:', error);
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scores = await prisma.score.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        word: {
          select: {
            word: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      message: 'Scores retrieved successfully',
      data: scores 
    });

  } catch (error) {
    console.error('Error retrieving scores:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
