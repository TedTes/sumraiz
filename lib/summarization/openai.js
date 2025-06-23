import OpenAI from 'openai';
import { getSummaryLengthParams, getContentTypePrompts } from './index';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Summarize content using OpenAI GPT models
 * @param {string} transcript - The transcript to summarize
 * @param {Object} options - Summarization options
 * @returns {Promise<string>} Generated summary
 */
export async function summarizeWithOpenAI(transcript, options = {}) {
  const { 
    length = 'brief', 
    type = 'meeting',
    modelId = 'gpt-4'
  } = options;

  try {
    console.log(`Generating summary with ${modelId}...`);

    // Get length and content type parameters
    const lengthParams = getSummaryLengthParams(transcript, length);
    const contentPrompts = getContentTypePrompts(type);

    // Select the appropriate GPT model
    const model = getGPTModel(modelId);
    
    // Build the prompt
    const prompt = buildSummaryPrompt(transcript, lengthParams, contentPrompts, type);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(type, lengthParams, contentPrompts)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: lengthParams.maxWords * 1.5, // Rough token estimate
      temperature: 0.3, // Low temperature for consistent, focused summaries
      top_p: 0.9
    });

    const summary = response.choices[0]?.message?.content?.trim();
    
    if (!summary) {
      throw new Error('OpenAI returned empty summary');
    }

    console.log(`${modelId} summary generated: ${summary.length} characters`);
    
    return summary;

  } catch (error) {
    console.error(`OpenAI summarization error with ${modelId}:`, error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI quota exceeded. Please try again later.');
    }
    
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('OpenAI rate limit exceeded. Please try again in a few minutes.');
    }
    
    if (error.code === 'context_length_exceeded') {
      throw new Error('Content too long for processing. Please try with shorter content.');
    }
    
    throw new Error(`OpenAI summarization failed: ${error.message}`);
  }
}

/**
 * Get the appropriate GPT model based on model ID
 * @param {string} modelId - Model identifier
 * @returns {string} OpenAI model name
 */
function getGPTModel(modelId) {
  const modelMap = {
    'gpt-4': 'gpt-4-1106-preview', // Latest GPT-4 Turbo
    'gpt-4-turbo': 'gpt-4-1106-preview',
    'gpt-3.5': 'gpt-3.5-turbo-1106'
  };
  
  return modelMap[modelId] || 'gpt-4-1106-preview';
}

/**
 * Build the system prompt for summarization
 * @param {string} type - Content type
 * @param {Object} lengthParams - Length parameters
 * @param {Object} contentPrompts - Content-specific prompts
 * @returns {string} System prompt
 */
function getSystemPrompt(type, lengthParams, contentPrompts) {
  return `You are an expert AI assistant specialized in creating ${lengthParams.focus} summaries of ${type} content.

Your task is to:
1. Create a ${contentPrompts.tone} summary
2. Focus on: ${contentPrompts.focus}
3. Structure the summary with: ${contentPrompts.structure}
4. Keep the summary between ${lengthParams.minWords}-${lengthParams.maxWords} words
5. Use ${lengthParams.structure} format

Guidelines:
- Be concise yet comprehensive
- Prioritize actionable information
- Use clear, professional language
- Include specific details when relevant
- Maintain logical flow and structure`;
}

/**
 * Build the main summarization prompt
 * @param {string} transcript - The transcript
 * @param {Object} lengthParams - Length parameters
 * @param {Object} contentPrompts - Content prompts
 * @param {string} type - Content type
 * @returns {string} Complete prompt
 */
function buildSummaryPrompt(transcript, lengthParams, contentPrompts, type) {
  const wordCount = transcript.split(' ').length;
  
  return `Please analyze and summarize the following ${type} transcript:

TRANSCRIPT:
${transcript}

REQUIREMENTS:
- Length: ${lengthParams.minWords}-${lengthParams.maxWords} words
- Format: ${lengthParams.structure}
- Focus: ${contentPrompts.focus}
- Tone: ${contentPrompts.tone}

Please provide a well-structured summary that captures the essential information and key insights from this ${wordCount}-word transcript.`;
}

/**
 * Validate summary quality and length
 * @param {string} summary - Generated summary
 * @param {Object} lengthParams - Expected length parameters
 * @returns {boolean} Whether summary meets quality standards
 */
export function validateSummaryQuality(summary, lengthParams) {
  if (!summary || summary.length < 50) {
    return false;
  }
  
  const wordCount = summary.split(' ').length;
  
  // Check if word count is within acceptable range (allow 20% variance)
  const minWords = lengthParams.minWords * 0.8;
  const maxWords = lengthParams.maxWords * 1.2;
  
  return wordCount >= minWords && wordCount <= maxWords;
}