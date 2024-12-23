import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const words = [
  'BANANA',
  'PEPPER',
  'GOOGLE',
  'COFFEE',
  'BUBBLE',
  'LETTER',
  'SUMMER',
  'MIRROR',
  'LITTLE',
  'YELLOW',
  'BUTTER',
  'RABBIT',
  'COOKIE',
  'CHEESE',
  'BOOKKEEPER',
  'TOMORROW',
  'BALLOON',
  'PATTERN',
  'SUCCESS',
  'CONNECT',
];

async function main() {
  console.log('Start seeding...');

  // Clear existing words
  await prisma.wordBank.deleteMany();
  await prisma.dailyWord.deleteMany(); // Also clear daily words to avoid orphaned references

  // Insert new words
  for (const word of words) {
    await prisma.wordBank.create({
      data: {
        word,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
