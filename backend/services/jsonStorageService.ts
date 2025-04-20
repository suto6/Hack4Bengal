// services/jsonStorageService.ts
import fs from 'fs';
import path from 'path';

// Define the path to the events.json file
const eventsFilePath = path.join(__dirname, '../data/events.json');

// Ensure the data directory exists
const ensureDataDirectoryExists = (): void => {
  const dataDir = path.dirname(eventsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Define the Event interface
export interface Event {
  id: string;
  name: string;
  organizer: string;
  details: string;
  startTime?: string | null;
  endTime?: string | null;
  date?: string | null;
  time: string;
  contactNumber: string;
  chatLink: string;
  faqs?: string | null;
  context?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define the EventCreateInput interface (without id and timestamps)
export type EventCreateInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

// Read all events from the JSON file
export const getAllEvents = (): Event[] => {
  ensureDataDirectoryExists();
  
  if (!fs.existsSync(eventsFilePath)) {
    // If the file doesn't exist, return an empty array
    return [];
  }
  
  try {
    const fileContent = fs.readFileSync(eventsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading events from JSON file:', error);
    return [];
  }
};

// Get an event by ID
export const getEventById = (id: string): Event | null => {
  const events = getAllEvents();
  return events.find(event => event.id === id) || null;
};

// Create a new event
export const createEvent = (eventData: EventCreateInput): Event => {
  const events = getAllEvents();
  
  // Generate a unique ID
  const id = `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create the new event
  const newEvent: Event = {
    ...eventData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add the new event to the array
  events.push(newEvent);
  
  // Save the updated array to the JSON file
  saveEvents(events);
  
  return newEvent;
};

// Update an event
export const updateEvent = (id: string, eventData: Partial<EventCreateInput>): Event | null => {
  const events = getAllEvents();
  const eventIndex = events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    return null;
  }
  
  // Update the event
  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData,
    updatedAt: new Date().toISOString()
  };
  
  // Save the updated array to the JSON file
  saveEvents(events);
  
  return events[eventIndex];
};

// Delete an event
export const deleteEvent = (id: string): boolean => {
  const events = getAllEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (filteredEvents.length === events.length) {
    // No event was removed
    return false;
  }
  
  // Save the updated array to the JSON file
  saveEvents(filteredEvents);
  
  return true;
};

// Save events to the JSON file
const saveEvents = (events: Event[]): void => {
  ensureDataDirectoryExists();
  
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error saving events to JSON file:', error);
  }
};

// Initialize the events.json file if it doesn't exist
export const initializeEventsFile = (): void => {
  ensureDataDirectoryExists();
  
  if (!fs.existsSync(eventsFilePath)) {
    saveEvents([]);
  }
};
