# WhatsApp LLM Event Assistant Backend

This backend powers a smart event assistant chatbot. Organizers can upload event details (including PDFs), and attendees can ask questions on WhatsApp. The bot answers using OpenAI based on the uploaded event context.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eventAssistant
   OPENAI_API_KEY=your-openai-api-key
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-phone-number
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Event Management

- **Create Event**: `POST /api/event/create`
  ```json
  {
    "name": "Hack4Bengal",
    "organizer": "AI Coders",
    "details": "Hack4Bengal is a 36-hour hackathon...",
    "time": "April 20, 2023, 10:00 AM",
    "whatsappNumber": "1234567890"
  }
  ```

- **Upload PDF for Event**: `POST /api/event/upload-pdf/:eventId`
  - Form data with key `pdf` containing the PDF file

- **Create Event with PDF**: `POST /api/event/create-with-pdf`
  - Form data with all event fields plus `pdf` file

### WhatsApp Integration

- **Webhook URL**: `POST /api/whatsapp/webhook`
  - Configure this URL in your Twilio WhatsApp Sandbox

- **Test Send Message**: `POST /api/whatsapp/send`
  ```json
  {
    "to": "1234567890",
    "message": "Hello from the event assistant!"
  }
  ```

## Twilio Setup

1. Create a Twilio account and set up a WhatsApp Sandbox
2. Configure the webhook URL to point to your `/api/whatsapp/webhook` endpoint
3. Test the integration by sending a message to your Twilio WhatsApp number

## How It Works

1. Event organizers upload event details and PDF documents
2. The system extracts text from PDFs and stores it as context
3. When users send questions via WhatsApp, the system:
   - Identifies the relevant event
   - Retrieves the event context
   - Sends the context + question to OpenAI
   - Returns the AI-generated response to the user

## Technologies Used

- Express.js: Backend framework
- Multer: File upload handling
- pdf-parse: PDF text extraction
- OpenAI API: Natural language processing
- Twilio API: WhatsApp integration
- MongoDB: Data storage
- TypeScript: Type safety
