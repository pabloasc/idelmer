-- CreateTable
CREATE TABLE "DailyWord" (
    "id" SERIAL NOT NULL,
    "word" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordBank" (
    "id" SERIAL NOT NULL,
    "word" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WordBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyWord_date_key" ON "DailyWord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WordBank_word_key" ON "WordBank"("word");
