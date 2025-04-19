HEAD
# 🎫 MessageMyTicket - WhatsApp-Based Event Ticketing System

**MessageMyTicket** is an easy-to-use, WhatsApp-based ticketing and registration bot that helps event organizers streamline user registrations, generate unique QR-code-based tickets, and manage attendance—all through a friendly chatbot interface.

🏆 Built in Hack4Bengal(Online).

---

## 🚀 Features

- Register for events via WhatsApp
- Automatically generate unique tickets with QR codes
- Verify tickets at the event gate by scanning
- Real-time database and attendance tracking
- Admin dashboard (coming soon)

# WhatsApp LLM Event Assistant

A smart event assistant chatbot that allows organizers to upload event details (including PDFs), and attendees to ask questions on WhatsApp. The bot answers using OpenAI based on the uploaded event context.

## Project Structure

- **Backend**: Express.js API with MongoDB, OpenAI, and Twilio integration
- **Frontend**: Next.js application with Tailwind CSS

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key
- Twilio account with WhatsApp Sandbox

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
   MONGO_URI=mongodb://localhost:27017/eventAssistant
   OPENAI_API_KEY=your-openai-api-key
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-phone-number
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

3. Start the frontend server:
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

1. **Create Event**: Organizers create an event with details and optionally upload a PDF
2. **Share Link**: The system generates a WhatsApp link that attendees can use
3. **Ask Questions**: Attendees send questions via WhatsApp
4. **Get Answers**: The system uses OpenAI to generate answers based on the event context

## Technologies Used

- **Backend**:
  - Express.js
  - MongoDB
  - OpenAI API
  - Twilio API
  - Multer (file uploads)
  - pdf-parse (PDF text extraction)

- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS
  - Axios

## API Endpoints

### Event Management

- **Create Event**: `POST /api/event/create`
- **Upload PDF**: `POST /api/event/upload-pdf/:eventId`
- **Create with PDF**: `POST /api/event/create-with-pdf`

### WhatsApp Integration

- **Webhook**: `POST /api/whatsapp/webhook`
- **Send Message**: `POST /api/whatsapp/send`
372c81c (mongodb remove hobe)
