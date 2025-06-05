/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `avatarUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Reaction_userId_postId_type_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "avatarUrl" SET DEFAULT 'https://guybzvdcsaxytioccpmf.supabase.co/storage/v1/object/public/blue-net//new_user_avatar.jpg';

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_key" ON "Reaction"("userId", "postId");
