# Whatzevent

A complete, functional, smooth-working LLM-powered chatbot application that allows event organizers to create events and attendees to ask questions about those events.

🏆 Built in Hack4Bengal(Online).

---

## 🚀 Features

- Event organizers can input event information as plain text
- The system stores event information in a SQLite database
- Each event gets a unique chatbot link
- Attendees can ask questions about the event through a web-based chat interface
- The chatbot provides specific, relevant answers based on the event information
- Powered by OpenAI's GPT models

## Project Structure

- **Backend**: Express.js API with SQLite (Prisma), OpenAI integration
- **Frontend**: Next.js application with Tailwind CSS

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   BACKEND_URL=http://localhost:5000
   ```

4. Start the frontend server:
   ```
   npm run dev
   ```

## How to Run the Application

1. Install all dependencies:
   ```
   npm run install-all
   ```

2. Start both the backend and frontend in development mode:
   ```
   npm run dev
   ```

3. For production:
   ```
   npm run build
   npm start
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Troubleshooting

### Hydration Errors

If you encounter React hydration errors (mismatches between server and client rendering), the application includes fixes for:

- Input components with browser auto-fill features
- Client-side only APIs like localStorage
- Browser extensions that modify the DOM

These are handled by:
- Using client-side only rendering for sensitive components
- Adding proper checks for browser-only APIs
- Using Next.js API proxy for simplified API calls

## How It Works

1. **Create Event**: Organizers create an event with details as plain text
2. **Share Link**: The system generates a unique chat link that attendees can use
3. **Ask Questions**: Attendees ask questions through the web-based chat interface
4. **Get Answers**: The system uses OpenAI to generate answers based on the event context

## Technologies Used

- **Backend**:
  - Express.js
  - SQLite with Prisma
  - OpenAI API

- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS
  - Axios

## API Endpoints

### Event Management

- **Create Event**: `POST /api/event/create`
- **Get Event**: `GET /api/event/:eventId`
- **Get All Events**: `GET /api/event`

### Chat Integration

- **Send Message**: `POST /api/chat`

## LLM Integration

The LLM receives this structured prompt for every user message:

```
You are an event assistant. Based on the following event information, answer the user's question:

Event Info: [event data from the organizer]
User Question: [the actual question asked]
```

The LLM then provides a fluent, helpful answer based on the event information.
