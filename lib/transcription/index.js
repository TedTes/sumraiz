import { transcribeWithOpenAI } from './openai';
import { transcribeWithAssemblyAI } from './assemblyai';

// Only import what we actually use: OpenAI (primary) + AssemblyAI (fallback)
const PROVIDERS = {
  openai: transcribeWithOpenAI,
  assemblyai: transcribeWithAssemblyAI
};

/**
 * Main transcription function with fallback strategy
 * @param {File} audioFile - The audio file to transcribe
 * @param {Object} options - Transcription options
 * @param {string} options.provider - Provider to use ('openai', 'assemblyai')
 * @param {boolean} options.enableTimestamps - Whether to include timestamps
 * @param {boolean} options.enableSpeakerLabels - Whether to identify speakers
 * @returns {Promise<Object>} Transcription result
 */
export async function transcribeAudio(audioFile, options = {}) {
  const {
    provider = 'openai',
    enableTimestamps = false,
    enableSpeakerLabels = false
  } = options;

  console.log(`Starting transcription with provider: ${provider}`);

  // Validate provider
  if (!PROVIDERS[provider]) {
    throw new Error(`Unsupported transcription provider: ${provider}`);
  }

  try {
    const startTime = Date.now();
    
    // Call the specific provider's transcription function
    const result = await PROVIDERS[provider](audioFile, {
      enableTimestamps,
      enableSpeakerLabels
    });
    
    const processingTime = Date.now() - startTime;
    
    // Standardize response format
    return {
      success: true,
      transcript: result.transcript,
      provider: provider,
      processingTime,
      metadata: {
        confidence: result.confidence || null,
        language: result.language || 'auto-detected',
        speakers: result.speakers || null,
        timestamps: result.timestamps || null
      }
    };

  } catch (error) {
    console.error(`Transcription failed with ${provider}:`, error);
    
    // Return standardized error format
    return {
      success: false,
      error: `Transcription failed: ${error.message}`,
      provider: provider
    };
  }
}

/**
 * Helper function to get file info for logging
 */
export function getAudioFileInfo(audioFile) {
  return {
    name: audioFile.name,
    size: `${Math.round(audioFile.size / 1024 / 1024)}MB`,
    type: audioFile.type,
    duration: null // Could be calculated if needed
  };
}