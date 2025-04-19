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
-- Copy data with defaults for new columns
INSERT INTO "new_Event" (
    "id", "name", "organizer", "details", "time", 
    "contactNumber", "chatLink", 
    "whatsappNumber", "whatsappMessage", 
    "context", "pdfPath", "createdAt", "updatedAt"
) 
SELECT 
    "id", "name", "organizer", "details", "time", 
    "whatsappNumber" AS "contactNumber", -- Use whatsappNumber as contactNumber
    "/event/" || "id" AS "chatLink", -- Generate chatLink from id
    "whatsappNumber", "whatsappMessage", 
    "context", "pdfPath", "createdAt", "updatedAt" 
FROM "Event";

DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
