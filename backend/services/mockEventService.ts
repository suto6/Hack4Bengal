// services/mockEventService.ts
import { Event } from "@prisma/client";

// Create a mock event for development and testing
export const createMockEvent = (eventId: string): Event => {
  console.log('Creating mock event with ID:', eventId);

  return {
    id: eventId,
    name: 'Hack4Bengal 2023',
    organizer: 'Bengal Developer Community',
    details: 'Hack4Bengal is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects. Teams of 2-4 members can participate. There will be prizes worth ₹50,000 for the winners.',
    startTime: '10:00 AM',
    endTime: '10:00 PM',
    date: 'June 15, 2023',
    time: 'June 15, 2023 at 10:00',
    contactNumber: '1234567890',
    chatLink: `/event/${eventId}`,
    whatsappNumber: '1234567890',
    whatsappMessage: `/event/${eventId}`,
    faqs: JSON.stringify([
      {
        question: 'Can I participate alone?',
        answer: 'No, you need to form a team of 2-4 members.'
      },
      {
        question: 'Do I need to bring my own laptop?',
        answer: 'Yes, all participants must bring their own laptops and chargers.'
      },
      {
        question: 'Will there be internet connectivity?',
        answer: 'Yes, high-speed Wi-Fi will be provided to all participants.'
      }
    ]),
    context: `Event Information:

Name: Hack4Bengal 2023
Organizer: Bengal Developer Community
Time: June 15, 2023 at 10:00 AM
Contact: 1234567890

Event Details:
Hack4Bengal is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects.

Venue Address:
TechHub Building, 123 Innovation Street, Kolkata, West Bengal 700001

Parking Information:
Free parking is available at the venue's north lot. Additional paid parking is available at the nearby City Center Mall for ₹50 per hour.

Accommodation Information:
Accommodation will be provided for all participants at the venue itself. Participants should bring their own toiletries. There are also several hotels within walking distance for those who prefer private accommodation.

Food & Refreshments:
Meals will be provided throughout the event including breakfast, lunch, and dinner. Snacks and beverages will be available 24/7. Vegetarian and non-vegetarian options will be available. Please inform us about any dietary restrictions during registration.

Certificates & Rewards:
All participants who complete the hackathon will receive certificates. The winning teams will receive prizes worth ₹50,000. There will also be special category prizes for innovation, design, and technical implementation.

Registration Information:
Registration is free but mandatory. Teams of 2-4 members can participate. The registration deadline is June 10, 2023. Each team should have at least one member with coding experience.

FAQs:
Q: Can I participate alone?
A: No, you need to form a team of 2-4 members.

Q: Do I need to bring my own laptop?
A: Yes, all participants must bring their own laptops and chargers.

Q: Will there be internet connectivity?
A: Yes, high-speed Wi-Fi will be provided to all participants.`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Check if an event ID is a mock ID
export const isMockEventId = (eventId: string): boolean => {
  return eventId.startsWith('mock-');
};
