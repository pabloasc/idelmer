import { PrismaClient } from '@prisma/client';
import { addDays, startOfDay, subHours } from 'date-fns';

const prisma = new PrismaClient();

const words = [
  'LETTER', 'COFFEE', 'SUMMER', 'BUBBLE', 'GOOGLE',
  'PEPPER', 'YELLOW', 'CHEESE', 'SCREEN', 'SOCCER',
  'MIRROR', 'BUTTER', 'RABBIT', 'COOKIE', 'LITTLE',
  'BANANA', 'GOOGLE', 'SCHOOL', 'STREET', 'BOTTLE',
  'MIDDLE', 'OFFICE', 'SLEEPY', 'PRETTY', 'FOOTER',
  'HAMMER', 'BETTER', 'DINNER', 'PUPPET', 'HAPPY'
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.dailyWord.deleteMany();

  // Get today's start date in UTC-3
  const now = new Date();
  const utcMinus3 = subHours(now, 3);
  const today = startOfDay(utcMinus3);

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
