import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { transcribeAudioWithOpenAI, summarizeMeetingWithOpenAI } from '../../../../lib/';
import { checkUsageLimit, incrementUserUsage } from '../../../../lib';

export async function POST(request) {
  try {
    // Authentication
    let authResult;
    try {
      authResult = await auth();
    } catch (error) {
      authResult = auth();
    }
    const { userId } = authResult || {};

    if (!userId) {
      return NextResponse.json({ 
        error: 'Please sign in to use MeetingMind' 
      }, { status: 401 });
    }

    // Check usage limits
    await checkUsageLimit(userId);

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const summaryLength = formData.get('summaryLength') || 'brief';
    const selectedModels = JSON.parse(formData.get('selectedModels') || '["gpt-4"]');
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateAudioFile(audioFile);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    console.log('Processing audio file:', {
      name: audioFile.name,
      size: `${Math.round(audioFile.size / 1024 / 1024)}MB`,
      selectedModels,
      summaryLength
    });

    // Step 1: Transcribe audio with fallback
    let transcriptionResult;
    console.log('Starting transcription...');
    try {
      transcriptionResult = await transcribeAudio(audioFile, { provider: 'openai' });
    } catch (error) {
      console.log(`openai transcription failed with error - ${error}, switching... to assemblyai`)
      transcriptionResult = await transcribeAudio(audioFile, { provider: 'assemblyai' });
    }


    if (!transcriptionResult.success) {
      return NextResponse.json(
        { error: transcriptionResult.error },
        { status: 400 }
      );
    }

    const transcript = transcriptionResult.transcript;
    console.log('Transcription completed:', {
      length: transcript.length,
      wordCount: transcript.split(' ').length
    });

    // Validate transcript quality
    if (!transcript || transcript.length < 50) {
      return NextResponse.json(
        { error: 'Unable to transcribe audio. Please ensure the file contains clear speech.' },
        { status: 400 }
      );
    }

    // Step 2: Generate summaries with selected models
    console.log('Starting summarization with models:', selectedModels);
    const summaryResults = await summarizeContent(transcript, {
      models: selectedModels,
      length: summaryLength,
      type: 'meeting'
    });

    if (!summaryResults.success) {
      return NextResponse.json(
        { error: summaryResults.error },
        { status: 500 }
      );
    }

    console.log('Summarization completed for models:', Object.keys(summaryResults.summaries));

    // Step 3: Increment usage
    await incrementUserUsage(userId);

    return NextResponse.json({
      success: true,
      transcript: transcript,
      summaries: summaryResults.summaries,
      metadata: {
        processingTime: summaryResults.processingTime,
        models: selectedModels,
        summaryLength,
        wordCount: transcript.split(' ').length
      }
    });

  } catch (error) {
    console.error('Processing error:', error);
    return handleError(error);
  }
}

function validateAudioFile(audioFile) {
  // Validate file type
  const allowedTypes = [
    'audio/mp3', 'audio/mpeg', 'audio/wav', 
    'audio/m4a', 'audio/webm', 'video/mp4', 
    'video/webm', 'video/mov'
  ];
  
  const allowedExtensions = /\.(mp3|m4a|wav|webm|mp4|mov)$/i;
  
  if (!allowedTypes.includes(audioFile.type) && !audioFile.name.match(allowedExtensions)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload MP3, M4A, WAV, WebM, MP4, or MOV files.'
    };
  }

  // Validate file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (audioFile.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Please upload files smaller than 100MB.'
    };
  }

  return { valid: true };
}

function handleError(error) {
  // Usage limit errors
  if (error.message.includes('Usage limit reached')) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  
  // API configuration errors
  if (error.message.includes('API key') || error.message.includes('configuration')) {
    return NextResponse.json(
      { error: 'Service configuration error. Please try again later.' },
      { status: 500 }
    );
  }
  
  // Rate limit errors
  if (error.message.includes('quota') || error.message.includes('rate limit')) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable due to high demand. Please try again in a few minutes.' },
      { status: 429 }
    );
  }
  
  // Transcription errors
  if (error.message.includes('transcribe') || error.message.includes('audio processing')) {
    return NextResponse.json(
      { error: 'Failed to process audio. Please ensure the file contains clear speech and try again.' },
      { status: 400 }
    );
  }
  
  // Summarization errors
  if (error.message.includes('summarize') || error.message.includes('summary')) {
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }

  // Generic error
  return NextResponse.json(
    { error: 'An unexpected error occurred. Please try again.' },
    { status: 500 }
  );
}