import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioFile) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text',
    });
    
    return transcription;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function summarizeMeeting(transcript) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert meeting summarizer. Create a comprehensive summary of the meeting transcript with the following structure:

**EXECUTIVE SUMMARY**
- 2-3 sentence overview of the meeting's main purpose and outcomes

**KEY DECISIONS**
- List major decisions made during the meeting
- Include who made each decision if mentioned

**ACTION ITEMS**
- Clear, specific tasks that need to be completed
- Include assignee and deadline if mentioned
- Format: "Task description - Assigned to: [Person] - Due: [Date]"

**IMPORTANT DISCUSSIONS**
- Main topics discussed
- Key points raised by participants
- Any concerns or challenges mentioned

**NEXT STEPS**
- What happens after this meeting
- Follow-up meetings or deadlines
- Dependencies or blockers

Keep the summary concise but comprehensive. Focus on actionable information.`
        },
        {
          role: 'user',
          content: `Please summarize this meeting transcript:\n\n${transcript}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to summarize meeting');
  }
}