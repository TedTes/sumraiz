import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio, summarizeMeeting } from '../../../lib/openai';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/webm'];
    if (!allowedTypes.includes(audioFile.type) && !audioFile.name.match(/\.(mp3|m4a|wav|webm)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload MP3, M4A, WAV, or WebM files.' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please upload files smaller than 50MB.' },
        { status: 400 }
      );
    }

    console.log('Starting transcription for file:', audioFile.name);
    
    // Step 1: Transcribe audio
    const transcript = await transcribeAudio(audioFile);
    console.log('Transcription completed, length:', transcript.length);
    
    if (!transcript || transcript.length < 50) {
      return NextResponse.json(
        { error: 'Unable to transcribe audio. Please ensure the file contains clear speech.' },
        { status: 400 }
      );
    }

    console.log('Starting summarization...');
    
    // Step 2: Summarize the transcript
    const summary = await summarizeMeeting(transcript);
    console.log('Summarization completed');

    return NextResponse.json({
      success: true,
      transcript: transcript,
      summary: summary,
    });

  } catch (error) {
    console.error('Processing error:', error);
    
    // Handle specific OpenAI errors
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'API configuration error. Please check server setup.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (error.message.includes('transcribe')) {
      return NextResponse.json(
        { error: 'Failed to process audio. Please ensure the file is a valid audio recording.' },
        { status: 400 }
      );
    }
    
    if (error.message.includes('summarize')) {
      return NextResponse.json(
        { error: 'Failed to generate summary. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}