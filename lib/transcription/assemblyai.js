/**
 * Transcribe audio using AssemblyAI as fallback
 * @param {File} audioFile - The audio file to transcribe
 * @param {Object} options - Transcription options
 * @returns {Promise<Object>} Transcription result
 */
export async function transcribeWithAssemblyAI(audioFile, options = {}) {
    const { 
      enableTimestamps = false, 
      enableSpeakerLabels = false 
    } = options;
  
    try {
      console.log('Calling AssemblyAI API...');
      
      // Step 1: Upload file to AssemblyAI
      const uploadUrl = await uploadFileToAssemblyAI(audioFile);
      
      // Step 2: Submit transcription request
      const transcriptId = await submitTranscriptionRequest(uploadUrl, {
        enableTimestamps,
        enableSpeakerLabels
      });
      
      // Step 3: Poll for completion
      const result = await pollForCompletion(transcriptId);
      
      console.log(`AssemblyAI transcription completed: ${result.text.length} characters`);
      
      return {
        transcript: result.text,
        language: result.language_code,
        confidence: result.confidence,
        timestamps: enableTimestamps ? formatTimestamps(result.words) : null,
        speakers: enableSpeakerLabels ? formatSpeakers(result.utterances) : null,
        provider: 'assemblyai'
      };
  
    } catch (error) {
      console.error('AssemblyAI transcription error:', error);
      throw new Error(`AssemblyAI transcription failed: ${error.message}`);
    }
  }
  
  /**
   * Upload audio file to AssemblyAI
   * @param {File} audioFile - Audio file to upload
   * @returns {Promise<string>} Upload URL
   */
  async function uploadFileToAssemblyAI(audioFile) {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('AssemblyAI API key not configured');
    }
  
    const formData = new FormData();
    formData.append('file', audioFile);
  
    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Upload failed: ${error.error}`);
    }
  
    const data = await response.json();
    return data.upload_url;
  }
  
  /**
   * Submit transcription request to AssemblyAI
   * @param {string} uploadUrl - URL of uploaded file
   * @param {Object} options - Transcription options
   * @returns {Promise<string>} Transcript ID
   */
  async function submitTranscriptionRequest(uploadUrl, options) {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    
    const requestBody = {
      audio_url: uploadUrl,
      language_detection: true, // Auto-detect language
      punctuate: true,
      format_text: true
    };
  
    // Add optional features
    if (options.enableTimestamps) {
      requestBody.word_timestamps = true;
    }
    
    if (options.enableSpeakerLabels) {
      requestBody.speaker_labels = true;
    }
  
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Transcription request failed: ${error.error}`);
    }
  
    const data = await response.json();
    return data.id;
  }
  
  /**
   * Poll AssemblyAI for transcription completion
   * @param {string} transcriptId - Transcript ID to poll
   * @returns {Promise<Object>} Completed transcription
   */
  async function pollForCompletion(transcriptId) {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    const maxAttempts = 60; // 5 minutes max wait
    let attempts = 0;
  
    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to check transcription status');
      }
  
      const data = await response.json();
      
      if (data.status === 'completed') {
        return data;
      }
      
      if (data.status === 'error') {
        throw new Error(`Transcription failed: ${data.error}`);
      }
      
      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }
    
    throw new Error('Transcription timeout - took longer than expected');
  }
  
  /**
   * Format timestamps from AssemblyAI word-level timestamps
   * @param {Array} words - Word-level timestamp data
   * @returns {Array} Formatted timestamps
   */
  function formatTimestamps(words) {
    if (!words) return null;
    
    return words.map(word => ({
      start: word.start / 1000, // Convert ms to seconds
      end: word.end / 1000,
      text: word.text
    }));
  }
  
  /**
   * Format speaker labels from AssemblyAI utterances
   * @param {Array} utterances - Speaker utterance data
   * @returns {Array} Formatted speaker information
   */
  function formatSpeakers(utterances) {
    if (!utterances) return null;
    
    return utterances.map(utterance => ({
      speaker: utterance.speaker,
      start: utterance.start / 1000,
      end: utterance.end / 1000,
      text: utterance.text
    }));
  }