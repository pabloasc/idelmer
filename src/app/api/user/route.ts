import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, email } = data;

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        updatedAt: new Date(),
      },
      create: {
        id,
        email,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { userId, won } = data;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const stats = await prisma.user.update({
      where: { id: userId },
      data: {
        totalGames: { increment: 1 },
        gamesWon: won ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
