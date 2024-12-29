import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const authHeader = request.headers.get('Authorization');

  // Validate authentication
  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Parse request body
    const body = await request.json();
    const { wordId, score, attempts, won, timeTaken, hintsUsed } = body;

    // Validate required fields
    if (!wordId || score === undefined || attempts === undefined || won === undefined) {
      return new NextResponse(JSON.stringify({ 
        error: 'Bad Request', 
        message: 'Missing required fields',
        received: { wordId, score, attempts, won }
      }), {
        status: 400,
      });
    }

    // Save or update score
    const result = await prisma.score.upsert({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId,
        },
      },
      update: {
        score,
        attempts,
        won,
        timeTaken,
        hintsUsed
      },
      create: {
        userId: user.id,
        wordId,
        score,
        attempts,
        won,
        timeTaken,
        hintsUsed
      },
    });

    return NextResponse.json({ 
      message: 'Score saved successfully', 
      data: result 
    });

  } catch (error) {
    console.error('Error saving score:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
    });
  }
}

export async function GET(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Get user's scores
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
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
    });
  }
}
