import { summarizeWithOpenAI } from './openai';
// import { summarizeWithClaude } from './claude';
// import { summarizeWithGemini } from './gemini';
// import { summarizeWithLlama } from './llama';

// Available summarization providers
const PROVIDERS = {
  'gpt-4': summarizeWithOpenAI,
  'claude-3-sonnet': summarizeWithClaude,
  'gemini-pro': summarizeWithGemini,
  'llama-2-70b': summarizeWithLlama
};

/**
 * Generate summaries using multiple AI models in parallel
 * @param {string} transcript - The transcript to summarize
 * @param {Object} options - Summarization options
 * @param {Array} options.models - Array of model IDs to use
 * @param {string} options.length - Summary length ('brief', 'medium', 'detailed')
 * @param {string} options.type - Content type ('meeting', 'lecture', 'interview')
 * @returns {Promise<Object>} Summarization results
 */
export async function summarizeContent(transcript, options = {}) {
  const {
    models = ['gpt-4'],
    length = 'brief',
    type = 'meeting'
  } = options;

  console.log(`Starting summarization with ${models.length} models:`, models);

  // Validate inputs
  if (!transcript || transcript.length < 50) {
    throw new Error('Transcript too short for meaningful summarization');
  }

  if (models.length === 0) {
    throw new Error('At least one model must be selected');
  }

  // Validate all models are supported
  const unsupportedModels = models.filter(model => !PROVIDERS[model]);
  if (unsupportedModels.length > 0) {
    throw new Error(`Unsupported models: ${unsupportedModels.join(', ')}`);
  }

  const startTime = Date.now();
  
  try {
    // Process all models in parallel
    const summaryPromises = models.map(async (modelId) => {
      try {
        console.log(`Starting summarization with ${modelId}...`);
        
        const summary = await PROVIDERS[modelId](transcript, {
          length,
          type,
          modelId
        });
        
        console.log(`${modelId} summarization completed`);
        
        return {
          modelId,
          summary,
          success: true
        };
        
      } catch (error) {
        console.error(`${modelId} summarization failed:`, error);
        
        return {
          modelId,
          summary: null,
          success: false,
          error: error.message
        };
      }
    });

    // Wait for all summarizations to complete
    const results = await Promise.allSettled(summaryPromises);
    
    // Process results
    const summaries = {};
    const errors = {};
    let successCount = 0;

    results.forEach((result, index) => {
      const modelId = models[index];
      
      if (result.status === 'fulfilled' && result.value.success) {
        summaries[modelId] = result.value.summary;
        successCount++;
      } else {
        const errorMessage = result.status === 'rejected' 
          ? result.reason?.message || 'Unknown error'
          : result.value.error;
        
        errors[modelId] = errorMessage;
        console.error(`${modelId} failed:`, errorMessage);
      }
    });

    const processingTime = Date.now() - startTime;

    // Check if at least one model succeeded
    if (successCount === 0) {
      throw new Error(`All summarization models failed: ${Object.values(errors).join(', ')}`);
    }

    console.log(`Summarization completed: ${successCount}/${models.length} models succeeded in ${processingTime}ms`);

    return {
      success: true,
      summaries,
      errors: Object.keys(errors).length > 0 ? errors : null,
      metadata: {
        processingTime,
        modelsRequested: models.length,
        modelsSucceeded: successCount,
        modelsFailed: models.length - successCount,
        transcriptLength: transcript.length,
        summaryLength: length,
        contentType: type
      }
    };

  } catch (error) {
    console.error('Summarization process failed:', error);
    
    return {
      success: false,
      error: error.message,
      summaries: {},
      metadata: {
        processingTime: Date.now() - startTime,
        modelsRequested: models.length,
        modelsSucceeded: 0,
        modelsFailed: models.length
      }
    };
  }
}

/**
 * Get optimal summary length parameters based on transcript length
 * @param {string} transcript - The transcript
 * @param {string} requestedLength - Requested length
 * @returns {Object} Length parameters
 */
export function getSummaryLengthParams(transcript, requestedLength) {
  const wordCount = transcript.split(' ').length;
  
  const lengthParams = {
    brief: {
      maxWords: Math.min(200, Math.floor(wordCount * 0.1)),
      minWords: 100,
      structure: 'bullet_points',
      focus: 'key_points_only'
    },
    medium: {
      maxWords: Math.min(500, Math.floor(wordCount * 0.2)),
      minWords: 250,
      structure: 'paragraphs',
      focus: 'detailed_insights'
    },
    detailed: {
      maxWords: Math.min(1000, Math.floor(wordCount * 0.3)),
      minWords: 500,
      structure: 'sections',
      focus: 'comprehensive_analysis'
    }
  };

  return lengthParams[requestedLength] || lengthParams.brief;
}

/**
 * Generate context-aware prompts based on content type
 * @param {string} type - Content type
 * @returns {Object} Prompt templates
 */
export function getContentTypePrompts(type) {
  const prompts = {
    meeting: {
      focus: 'action items, decisions, key discussion points, and next steps',
      structure: 'Key Points, Action Items, Decisions Made, Next Steps',
      tone: 'professional and actionable'
    },
    lecture: {
      focus: 'main concepts, examples, and learning objectives',
      structure: 'Main Topics, Key Concepts, Examples, Summary',
      tone: 'educational and comprehensive'
    },
    interview: {
      focus: 'insights, quotes, and main themes discussed',
      structure: 'Key Insights, Notable Quotes, Main Themes, Takeaways',
      tone: 'engaging and insightful'
    },
    podcast: {
      focus: 'main topics, interesting points, and guest insights',
      structure: 'Episode Overview, Key Topics, Highlights, Takeaways',
      tone: 'engaging and conversational'
    }
  };

  return prompts[type] || prompts.meeting;
}