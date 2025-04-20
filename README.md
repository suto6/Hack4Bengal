#  WhatsEvent - AI-Powered Event Assistant


**Let your event answer its own questions!** WhatsEvent is an AI chatbot that automatically handles attendee queries about your event, saving organizers hours of repetitive communication.

## ✨ Features

- **Instant AI Q&A** - Attendees get 24/7 answers about your event
- **Zero-Code Setup** - Just paste event details and create the bot
- **Easy to Share** -  One link for everything your attendees need to know
- **Customizable** - Brand with your event's customm data

## 🛠 How It Works
graph LR
    A[Organizer] --> B[Create Event]
    B --> C[Chatbot Link]
    C --> D[Attendees]
    D --> E[AI Answers]


## 🏁 Quick Start
### Prerequisites
- Node.js 18+
- OpenAI API key
- PostgreSQL/Supabase

```bash
git clone https://github.com/suto6/WhatsEvent.git
cd WhatsEvent
npm install
cp .env.example .env  # Add your credentials
npm run dev
```
## 🤖 Tech Stack

**Frontend**  
- Next.js 14  
- TypeScript  
- Tailwind CSS  
- shadcn/ui  

**AI & Backend**  
- OpenAI API  
- Next.js API Routes  

**Data**  
- SQLite  
- prisma  
