// services/prismaService.ts
import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

// Add seed data if needed
export const seedDatabase = async (): Promise<void> => {
  const eventCount = await prisma.event.count();
  
  // Only seed if the database is empty
  if (eventCount === 0) {
    console.log('Seeding database with sample events...');
    
    // Create sample events
    await prisma.event.create({
      data: {
        name: 'Hack4Bengal 2023',
        organizer: 'Bengal Developer Community',
        details: 'Hack4Bengal is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects.',
        time: 'June 15, 2023 at 10:00',
        whatsappNumber: '1234567890',
        whatsappMessage: 'https://wa.me/1234567890?text=Hi%20about%20Hack4Bengal%202023',
        context: 'Hack4Bengal is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects. The event will be held on June 15, 2023, starting at 10:00 AM. There will be prizes worth ₹50,000 for the winners. Food and accommodation will be provided for all participants.',
      },
    });
    
    await prisma.event.create({
      data: {
        name: 'AI Workshop',
        organizer: 'Tech Innovators',
        details: 'Learn about the latest advancements in AI and machine learning in this hands-on workshop.',
        time: 'July 5, 2023 at 14:00',
        whatsappNumber: '9876543210',
        whatsappMessage: 'https://wa.me/9876543210?text=Hi%20about%20AI%20Workshop',
        context: 'This AI Workshop will cover the fundamentals of artificial intelligence and machine learning. Participants will get hands-on experience with popular AI frameworks and tools. The workshop will be held on July 5, 2023, from 2:00 PM to 6:00 PM. Registration is required, and seats are limited to 50 participants.',
      },
    });
    
    console.log('Database seeded successfully!');
  }
};

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
