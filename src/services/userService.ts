import { prisma } from '@/lib/prisma';
import { User } from '@supabase/supabase-js';

export async function createOrUpdateUser(supabaseUser: User) {
  return await prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {
      email: supabaseUser.email!,
      updatedAt: new Date(),
    },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email!,
    },
  });
}

export async function updateUserStats(userId: string, won: boolean) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      totalGames: { increment: 1 },
      gamesWon: won ? { increment: 1 } : undefined,
    },
  });
}

export async function createOrUpdateScore(
  userId: string,
  wordId: number,
  score: number,
  attempts: number,
  won: boolean,
  completed: boolean
) {
  return await prisma.score.upsert({
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
}

export async function getUserStats(userId: string) {
  return await prisma.user.findUnique({
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
}

export async function getLeaderboard() {
  return await prisma.user.findMany({
    orderBy: { highestScore: 'desc' },
    take: 10,
    select: {
      email: true,
      highestScore: true,
      totalGames: true,
      gamesWon: true,
    },
  });
}
