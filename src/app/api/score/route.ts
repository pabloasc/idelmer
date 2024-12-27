import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  // Get session from cookie
  const supabaseAuthToken = cookieStore.get('sb-access-token')?.value;
  
  try {
    if (!supabaseAuthToken) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(supabaseAuthToken);
    
    if (userError || !user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get('wordId');

    if (!wordId) {
      return new NextResponse(JSON.stringify({ error: 'Word ID is required' }), {
        status: 400,
      });
    }

    const score = await prisma.score.findFirst({
      where: {
        userId: user.id,
        wordId: parseInt(wordId),
      },
      select: {
        score: true,
        attempts: true,
        won: true,
        lost: true,
        lastGuess: true,
        revealedLetters: true,
      },
    });

    return new NextResponse(JSON.stringify(score), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in GET /api/score:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  // Get session from cookie
  const supabaseAuthToken = cookieStore.get('sb-access-token')?.value;
  
  try {
    if (!supabaseAuthToken) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(supabaseAuthToken);
    
    if (userError || !user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { wordId, score, attempts, won, lost, lastGuess, revealedLetters } = body;

    if (!wordId || typeof score !== 'number' || typeof attempts !== 'number') {
      return new NextResponse(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
      });
    }

    const updatedScore = await prisma.score.upsert({
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
        lost,
        lastGuess,
        revealedLetters,
      },
      create: {
        userId: user.id,
        wordId,
        score,
        attempts,
        won,
        lost,
        lastGuess,
        revealedLetters,
      },
    });

    return new NextResponse(JSON.stringify(updatedScore), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in POST /api/score:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
