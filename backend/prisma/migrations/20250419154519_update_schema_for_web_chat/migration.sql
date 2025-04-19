/*
  Warnings:

  - You are about to drop the column `joinCode` on the `Event` table. All the data in the column will be lost.
  - Added the required column `chatLink` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "chatLink" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappMessage" TEXT NOT NULL,
    "context" TEXT,
    "pdfPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("context", "createdAt", "details", "id", "name", "organizer", "pdfPath", "time", "updatedAt", "whatsappMessage", "whatsappNumber") SELECT "context", "createdAt", "details", "id", "name", "organizer", "pdfPath", "time", "updatedAt", "whatsappMessage", "whatsappNumber" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
