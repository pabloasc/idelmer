import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type UserData = {
  totalScore: number;
  totalGames: number;
  gamesWon: number;
  currentStreak?: number;
};

async function createUser(id: string, email: string) {
  const username = email.split('@')[0];
  return await prisma.user.create({
    data: {
      id,
      email,
      username,
      totalScore: 0,
      totalGames: 0,
      gamesWon: 0,
      currentStreak: 0
    },
  });
}

async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId }
  });
}

async function updateUser(userId: string, data: Partial<UserData & { username?: string; language?: string }>) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      totalScore: data.totalScore,
      totalGames: data.totalGames,
      gamesWon: data.gamesWon,
      currentStreak: data.currentStreak,
      username: data.username,
      language: data.language,
    },
  });
}

export async function POST(request: Request) {
  try {
    const { id, email } = await request.json();
    const existingUser = await getUserById(id);
    if (!existingUser) {
      const user = await createUser(id, email);
      return NextResponse.json(user);
    }
    return NextResponse.json(existingUser);
    
  } catch (error) {
    console.error('Error in POST /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const data = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = await updateUser(userId, data);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in PATCH /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
