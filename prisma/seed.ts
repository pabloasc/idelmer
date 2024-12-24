import { PrismaClient } from '@prisma/client';
import { addDays, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

const words = [
  'APPLE', 'BEACH', 'CLOUD', 'DREAM', 'EARTH', 
  'FLAME', 'GRAPE', 'HEART', 'IMAGE', 'JUICE',
  'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN',
  'PEACE', 'QUEEN', 'RIVER', 'STORM', 'TIGER',
  'UNITY', 'VOICE', 'WATER', 'YOUTH', 'ZEBRA',
  'BLOOM', 'CHARM', 'DANCE', 'EAGLE', 'FROST'
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.dailyWord.deleteMany();

  // Get today's start date
  const today = startOfDay(new Date());

  // Create daily words for the next 30 days
  const dailyWords = words.map((word, index) => ({
    word,
    date: addDays(today, index),
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // Insert all daily words
  await prisma.dailyWord.createMany({
    data: dailyWords
  });

  console.log(`Created ${dailyWords.length} daily words`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
