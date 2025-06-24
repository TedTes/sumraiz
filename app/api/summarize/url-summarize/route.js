import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkUsageLimit, incrementUserUsage, summarizeContent, extractAudioFromUrl } from '../../../../lib';

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
        error: 'Please sign in to use sumraiz' 
      }, { status: 401 });
    }

    // Check usage limits
    await checkUsageLimit(userId);

    // Parse JSON data
    const body = await request.json();
    const { url, type = 'media', summaryLength = 'brief', selectedModels = ['gpt-4'] } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    // Validate URL
    const validation = validateUrl(url, type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    console.log('Processing URL:', {
      url: url.substring(0, 100) + '...',
      type,
      selectedModels,
      summaryLength
    });

    // Step 1: Extract audio from URL with fallback providers
    let extractionResult;
    console.log('Starting audio extraction from URL...');
    
    try {
      // Try primary extraction method (e.g., yt-dlp for YouTube, direct download for others)
      extractionResult = await extractAudioFromUrl(url, { 
        provider: 'primary',
        format: 'mp3',
        quality: 'high'
      });
    } catch (error) {
      console.log(`Primary extraction failed with error - ${error}, trying fallback...`);
      try {
        // Fallback extraction method
        extractionResult = await extractAudioFromUrl(url, { 
          provider: 'fallback',
          format: 'wav',
          quality: 'medium'
        });
      } catch (fallbackError) {
        console.log(`Fallback extraction failed with error - ${fallbackError}`);
        throw new Error(`Failed to extract audio from URL: ${fallbackError.message}`);
      }
    }

    if (!extractionResult.success) {
      return NextResponse.json(
        { error: extractionResult.error },
        { status: 400 }
      );
    }

    const { audioBuffer, metadata } = extractionResult;
    console.log('Audio extraction completed:', {
      duration: metadata?.duration,
      size: `${Math.round((audioBuffer?.length || 0) / 1024 / 1024)}MB`,
      title: metadata?.title
    });

    // Step 2: Transcribe extracted audio with fallback
    let transcriptionResult;
    console.log('Starting transcription...');
    try {
      transcriptionResult = await transcribeAudio(audioBuffer, { 
        provider: 'openai',
        metadata: metadata
      });
    } catch (error) {
      console.log(`OpenAI transcription failed with error - ${error}, switching to AssemblyAI...`);
      transcriptionResult = await transcribeAudio(audioBuffer, { 
        provider: 'assemblyai',
        metadata: metadata
      });
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
        { error: 'Unable to transcribe audio from URL. The content may not contain clear speech.' },
        { status: 400 }
      );
    }

    // Step 3: Generate summaries with selected models
    console.log('Starting summarization with models:', selectedModels);
    const summaryResults = await summarizeContent(transcript, {
      models: selectedModels,
      length: summaryLength,
      type: type === 'meeting' ? 'meeting' : 'media',
      metadata: {
        source: 'url',
        originalUrl: url,
        title: metadata?.title,
        duration: metadata?.duration
      }
    });

    if (!summaryResults.success) {
      return NextResponse.json(
        { error: summaryResults.error },
        { status: 500 }
      );
    }

    console.log('Summarization completed for models:', Object.keys(summaryResults.summaries));

    // Step 4: Increment usage
    await incrementUserUsage(userId);

    return NextResponse.json({
      success: true,
      transcript: transcript,
      summaries: summaryResults.summaries,
      metadata: {
        processingTime: summaryResults.processingTime,
        models: selectedModels,
        summaryLength,
        wordCount: transcript.split(' ').length,
        source: {
          url: url,
          title: metadata?.title,
          duration: metadata?.duration,
          type: type
        }
      }
    });

  } catch (error) {
    console.error('URL processing error:', error);
    return handleError(error);
  }
}

function validateUrl(url, type) {
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'Invalid URL protocol. Only HTTP and HTTPS URLs are supported.'
      };
    }

    // Validate based on type
    if (type === 'media') {
      // Check for supported platforms
      const supportedDomains = [
        'youtube.com', 'youtu.be', 'vimeo.com', 'soundcloud.com',
        'spotify.com', 'dailymotion.com', 'twitch.tv', 'facebook.com',
        'instagram.com', 'tiktok.com', 'twitter.com', 'x.com'
      ];
      
      const hostname = urlObj.hostname.toLowerCase();
      const isSupported = supportedDomains.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      
      // Also allow direct media file URLs
      const mediaExtensions = /\.(mp3|m4a|wav|webm|mp4|mov|avi|flv)(\?.*)?$/i;
      const isDirectMedia = mediaExtensions.test(urlObj.pathname);
      
      if (!isSupported && !isDirectMedia) {
        return {
          valid: false,
          error: 'Unsupported URL. Please provide a YouTube, Vimeo, SoundCloud, Spotify, or direct media file URL.'
        };
      }
    }

    // Check URL length
    if (url.length > 2048) {
      return {
        valid: false,
        error: 'URL too long. Please provide a shorter URL.'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format. Please provide a valid URL.'
    };
  }
}

function handleError(error) {
  // Usage limit errors
  if (error.message.includes('Usage limit reached')) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  
  // URL extraction errors
  if (error.message.includes('extract audio') || error.message.includes('download')) {
    return NextResponse.json(
      { error: 'Failed to extract audio from URL. The content may be private, restricted, or unavailable.' },
      { status: 400 }
    );
  }
  
  // Geo-blocking or access errors
  if (error.message.includes('geo') || error.message.includes('region') || error.message.includes('blocked')) {
    return NextResponse.json(
      { error: 'Content is not available in your region or may be restricted.' },
      { status: 403 }
    );
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
  
  // Network/timeout errors
  if (error.message.includes('timeout') || error.message.includes('network') || error.message.includes('ECONNRESET')) {
    return NextResponse.json(
      { error: 'Network timeout. The URL may be too large or slow to process. Please try again.' },
      { status: 408 }
    );
  }
  
  // Transcription errors
  if (error.message.includes('transcribe') || error.message.includes('audio processing')) {
    return NextResponse.json(
      { error: 'Failed to process audio from URL. Please ensure the content contains clear speech.' },
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

  // Content too long errors
  if (error.message.includes('too long') || error.message.includes('duration limit')) {
    return NextResponse.json(
      { error: 'Content is too long to process. Please provide content under 3 hours in duration.' },
      { status: 413 }
    );
  }

  // Generic error
  return NextResponse.json(
    { error: 'An unexpected error occurred while processing the URL. Please try again.' },
    { status: 500 }
  );
}