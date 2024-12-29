import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { preferredLanguage: true },
    });

    return NextResponse.json({ language: dbUser?.preferredLanguage || 'en' });
  } catch (error) {
    console.error('Error fetching language:', error);
    return NextResponse.json(
      { error: 'Failed to fetch language' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { language } = await request.json();
    if (!language || !['en', 'es'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: { preferredLanguage: language },
    });

    return NextResponse.json({ language: updatedUser.preferredLanguage });
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json(
      { error: 'Failed to update language' },
      { status: 500 }
    );
  }
}
