// utils/inMemoryStore.ts

// Define the Event interface
export interface InMemoryEvent {
  _id: string;
  name: string;
  organizer: string;
  details: string;
  time: string;
  whatsappNumber: string;
  whatsappMessage: string;
  context?: string;
  pdfPath?: string;
}

// In-memory storage for events
const events: InMemoryEvent[] = [];

// Generate a simple ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Create a new event
export const createEvent = (eventData: Omit<InMemoryEvent, '_id'>): InMemoryEvent => {
  const newEvent: InMemoryEvent = {
    _id: generateId(),
    ...eventData
  };
  
  events.push(newEvent);
  return newEvent;
};

// Find an event by ID
export const findEventById = (id: string): InMemoryEvent | undefined => {
  return events.find(event => event._id === id);
};

// Find events by name (case-insensitive)
export const findEventsByName = (name: string): InMemoryEvent[] => {
  const lowerName = name.toLowerCase();
  return events.filter(event => 
    event.name.toLowerCase().includes(lowerName)
  );
};

// Find events by WhatsApp number
export const findEventsByWhatsAppNumber = (number: string): InMemoryEvent[] => {
  return events.filter(event => event.whatsappNumber === number);
};

// Get all events
export const getAllEvents = (): InMemoryEvent[] => {
  return [...events];
};

// Update an event
export const updateEvent = (id: string, updates: Partial<InMemoryEvent>): InMemoryEvent | null => {
  const index = events.findIndex(event => event._id === id);
  
  if (index === -1) {
    return null;
  }
  
  events[index] = {
    ...events[index],
    ...updates
  };
  
  return events[index];
};

// Delete an event
export const deleteEvent = (id: string): boolean => {
  const index = events.findIndex(event => event._id === id);
  
  if (index === -1) {
    return false;
  }
  
  events.splice(index, 1);
  return true;
};

// Add some sample data
export const addSampleData = (): void => {
  if (events.length === 0) {
    createEvent({
      name: 'Hack4Bengal 2023',
      organizer: 'Bengal Developer Community',
      details: 'Hack4Bengal is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects.',
      time: 'June 15, 2023 at 10:00',
      whatsappNumber: '1234567890',
      whatsappMessage: 'https://wa.me/1234567890?text=Hi%20about%20Hack4Bengal%202023',
      context: 'Hack4Bengal is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects. The event will be held on June 15, 2023, starting at 10:00 AM. There will be prizes worth ₹50,000 for the winners. Food and accommodation will be provided for all participants.'
    });
    
    createEvent({
      name: 'AI Workshop',
      organizer: 'Tech Innovators',
      details: 'Learn about the latest advancements in AI and machine learning in this hands-on workshop.',
      time: 'July 5, 2023 at 14:00',
      whatsappNumber: '9876543210',
      whatsappMessage: 'https://wa.me/9876543210?text=Hi%20about%20AI%20Workshop',
      context: 'This AI Workshop will cover the fundamentals of artificial intelligence and machine learning. Participants will get hands-on experience with popular AI frameworks and tools. The workshop will be held on July 5, 2023, from 2:00 PM to 6:00 PM. Registration is required, and seats are limited to 50 participants.'
    });
  }
};

// Initialize with sample data
addSampleData();
