import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get today's date in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Fetching word for date:', today.toISOString());

    // Try to get today's word
    let dailyWord = await prisma.dailyWord.findUnique({
      where: {
        date: today,
      },
    });

    console.log('Existing daily word:', dailyWord);

    // If no word exists for today, create one
    if (!dailyWord) {
      console.log('No word found for today, getting a new one...');
      
      // Get a random unused word from the word bank
      const randomWord = await prisma.wordBank.findFirst({
        where: {
          used: false,
        },
        orderBy: {
          // Use random() for true randomization
          id: 'desc',
        },
      });

      console.log('Random word found:', randomWord);

      if (!randomWord) {
        console.log('No unused words found, resetting all words...');
        // Reset all words to unused if we've used them all
        await prisma.wordBank.updateMany({
          data: {
            used: false,
          },
        });
        
        // Try getting a word again
        const resetWord = await prisma.wordBank.findFirst({
          orderBy: {
            id: 'desc',
          },
        });

        console.log('Reset word found:', resetWord);

        if (!resetWord) {
          console.error('No words available in word bank at all');
          throw new Error('No words available in word bank');
        }

        // Mark this word as used
        await prisma.wordBank.update({
          where: {
            id: resetWord.id,
          },
          data: {
            used: true,
          },
        });

        // Create today's word
        dailyWord = await prisma.dailyWord.create({
          data: {
            word: resetWord.word,
            date: today,
          },
        });

        console.log('Created new daily word from reset:', dailyWord);
      } else {
        // Mark this word as used
        await prisma.wordBank.update({
          where: {
            id: randomWord.id,
          },
          data: {
            used: true,
          },
        });

        // Create today's word
        dailyWord = await prisma.dailyWord.create({
          data: {
            word: randomWord.word,
            date: today,
          },
        });

        console.log('Created new daily word:', dailyWord);
      }
    }

    if (!dailyWord || !dailyWord.word) {
      console.error('No word available after all attempts');
      throw new Error('Failed to get or create daily word');
    }

    return NextResponse.json({ word: dailyWord.word });
  } catch (error) {
    console.error('Error getting daily word:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return NextResponse.json(
      { error: 'Failed to get daily word' },
      { status: 500 }
    );
  }
}
