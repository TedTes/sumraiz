import {openai} from "../instances/openai";

/**
 * Transcribe audio using OpenAI's Whisper API
 * @param {File} audioFile - The audio file to transcribe
 * @param {Object} options - Transcription options
 * @returns {Promise<Object>} Transcription result
 */
export async function transcribeWithOpenAI(audioFile, options = {}) {
  const { enableTimestamps = false } = options;

  try {
    console.log('Calling OpenAI Whisper API...');
    
    // Prepare the request parameters
    const transcriptionParams = {
      file: audioFile,
      model: 'whisper-1',
      response_format: enableTimestamps ? 'verbose_json' : 'text'
    };

    // Add optional parameters if specified
    if (options.prompt) {
      transcriptionParams.prompt = options.prompt; // Context for better accuracy
    }

    // Call OpenAI Whisper API
    const response = await openai.audio.transcriptions.create(transcriptionParams);

    let transcript, timestamps, language, confidence;

    if (enableTimestamps) {
      // Verbose JSON response includes detailed information
      transcript = response.text;
      language = response.language;
      confidence = calculateAverageConfidence(response.segments);
      timestamps = response.segments?.map(segment => ({
        start: segment.start,
        end: segment.end,
        text: segment.text
      }));
    } else {
      // Simple text response
      transcript = response;
    }

    console.log(`OpenAI transcription completed: ${transcript.length} characters`);

    return {
      transcript: transcript.trim(),
      language,
      confidence,
      timestamps,
      provider: 'openai',
      model: 'whisper-1'
    };

  } catch (error) {
    console.error('OpenAI transcription error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI quota exceeded. Please try again later.');
    }
    
    if (error.code === 'invalid_request_error') {
      throw new Error('Invalid audio file format or corrupted file.');
    }
    
    if (error.status === 413) {
      throw new Error('Audio file too large for OpenAI Whisper (25MB limit).');
    }
    
    throw new Error(`OpenAI transcription failed: ${error.message}`);
  }
}

/**
 * Calculate average confidence from Whisper segments
 * @param {Array} segments - Whisper segments with confidence scores
 * @returns {number} Average confidence (0-1)
 */
function calculateAverageConfidence(segments) {
  if (!segments || segments.length === 0) return null;
  
  const confidences = segments
    .filter(segment => segment.avg_logprob !== undefined)
    .map(segment => Math.exp(segment.avg_logprob)); // Convert log prob to confidence
  
  if (confidences.length === 0) return null;
  
  return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
}

/**
 * Prepare audio file for OpenAI (handle format conversion if needed)
 * @param {File} audioFile - Original audio file
 * @returns {File} Processed audio file
 */
export function prepareAudioForOpenAI(audioFile) {
  // OpenAI Whisper supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
  const supportedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];
  
  const fileExtension = audioFile.name.split('.').pop().toLowerCase();
  
  if (!supportedFormats.includes(fileExtension)) {
    throw new Error(`Unsupported audio format: ${fileExtension}. Supported formats: ${supportedFormats.join(', ')}`);
  }
  
  // Check file size (25MB OpenAI limit)
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (audioFile.size > maxSize) {
    throw new Error('Audio file exceeds OpenAI Whisper size limit (25MB). Please compress or trim the file.');
  }
  
  return audioFile;
}