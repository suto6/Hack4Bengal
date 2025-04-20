// Test script for JSON storage
const jsonStorage = require('./dist/services/jsonStorageService');

// Initialize the events.json file
jsonStorage.initializeEventsFile();

// Create a test event
const testEvent = {
  name: 'Test Event',
  organizer: 'Test Organizer',
  details: 'This is a test event with details about the venue, schedule, and other information.',
  startTime: '10:00 AM',
  endTime: '5:00 PM',
  date: '2023-06-15',
  time: '2023-06-15 at 10:00 AM to 5:00 PM',
  contactNumber: '1234567890',
  chatLink: '/event/placeholder',
  faqs: JSON.stringify([
    { question: 'Is it free?', answer: 'Yes!' },
    { question: 'Is prior knowledge needed?', answer: 'No, all levels welcome.' }
  ]),
  context: 'Additional context for the event'
};

// Create the event
const createdEvent = jsonStorage.createEvent(testEvent);
console.log('Created event:', createdEvent);

// Get all events
const allEvents = jsonStorage.getAllEvents();
console.log('All events:', allEvents);

// Get event by ID
const retrievedEvent = jsonStorage.getEventById(createdEvent.id);
console.log('Retrieved event:', retrievedEvent);

console.log('JSON storage test completed successfully!');
