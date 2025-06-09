# MeetingMind - AI Meeting Summarizer

Transform your meeting recordings into actionable summaries with AI-powered transcription and intelligent analysis.

## Features

- **Smart Audio Transcription**: Upload MP3, M4A, WAV, or WebM files
- **Structured Summaries**: Get organized sections for:
  - Executive Summary
  - Key Decisions
  - Action Items (with assignees and deadlines)
  - Important Discussions
  - Next Steps
- **Copy & Download**: Easy sharing and archiving of summaries
- **Real-time Processing**: Visual progress tracking during analysis

## Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd meetingmind
npm install
```

2. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

1. **Upload Audio**: Drag and drop or click to select your meeting recording
2. **Wait for Processing**: Watch real-time progress (2-3 minutes typical)
3. **Review Summary**: Get structured insights with action items
4. **Copy or Download**: Share with your team or save for records

## Supported File Formats

- **MP3** - Most common format
- **M4A** - iPhone/Mac recordings  
- **WAV** - High quality audio
- **WebM** - Browser recordings
- **Max file size**: 50MB

## Technical Architecture

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Clean, consistent icons

### Backend
- **OpenAI Whisper** - Speech-to-text transcription
- **GPT-4** - Intelligent meeting summarization
- **Next.js API Routes** - Serverless backend

### Key Design Principles
- **Single Magic Moment**: Upload → Summary (one core workflow)
- **No Complexity**: No auth, databases, or user accounts
- **Immediate Value**: Working solution in minutes

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_api_key
```

## API Costs

Approximate costs per meeting:
- **Whisper API**: ~$0.006 per minute of audio
- **GPT-4 API**: ~$0.03-0.06 per summary
- **45-minute meeting**: ~$0.30-0.35 total

## Project Structure

```
meetingmind/
├── app/
│   ├── page.js              # Main application page
│   ├── layout.js            # Root layout and metadata
│   ├── globals.css          # Global styles and Tailwind
│   └── api/summarize/
│       └── route.js         # Audio processing API endpoint
├── components/
│   ├── Header.js            # App header with branding
│   ├── FileUpload.js        # Drag & drop file upload
│   ├── ProcessingStatus.js  # Real-time progress tracking
│   └── SummaryDisplay.js    # Formatted summary output
├── lib/
│   └── openai.js            # OpenAI API integration
└── README.md
```