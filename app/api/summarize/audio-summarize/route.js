import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { transcribeAudioWithOpenAI, summarizeMeetingWithOpenAI } from '../../../../lib/';
import { checkUsageLimit, incrementUserUsage } from '../../../../lib';

export async function POST(request) {
  try {
    // Try both sync and async versions of auth()
    let authResult;
    try {
      authResult = await auth();
    } catch (error) {
      // If await fails, try sync version
      authResult = auth();
    }
    const { userId } = authResult || {};

    if (!userId) {
      return NextResponse.json({ error: 'Please sign in to use MeetingMind' }, { status: 401 });
    }

    await checkUsageLimit(userId);

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
    console.log('Selected models:', selectedModels);
    console.log('Summary length:', summaryLength);
    
    // Mock transcript
    const transcript = `Alex: Good morning everyone! Let's wait a minute or two for everyone to join.

Priya: Morning! Just grabbing coffee but I'm here 👋

Jordan: Hey all, good to see you!

Sam: Morning! Ready when you are.

Alex: Great! Kicking things off—today we're reviewing the Q3 roadmap and confirming next sprint goals. First, an update on the mobile app beta.

Priya: We're 85% done. The API integration with the payments module is complete. We need one more round of testing for edge cases.

Taylor: Noted! I'll schedule the edge case run-through for tomorrow.

Alex: Perfect. @Jordan, how's the feedback from usability testing?

Jordan: Positive so far. Users like the new onboarding flow, but 3 out of 10 had trouble finding the account settings.

Alex: Thanks! Let's prioritize a redesign on that.

Jordan: Will do. I'll mock something up by EOD Friday.

Sam: Quick heads-up: The launch campaign prep is underway. We'll need final screenshots and a feature list by next Tuesday.

Priya: We can provide a staging build for marketing by Monday.

Alex: Awesome. One last thing—our next sprint will focus on performance improvements and bug fixes.

Taylor: I'll compile all reported issues into a clean ticket list.

Sam: 👍 Works for me.

Jordan: Same here.

Alex: Cool! I'll share meeting notes and action items by end of day. Thanks everyone!

Priya: Thanks, all. Good progress today!

Taylor: Bye everyone`;

    console.log('Starting summarization...');
    
    // Generate test summaries for selected models
    const testSummaries = {};
    
    // Base content varies by summary length
    const getBaseSummary = (length) => {
      switch (length) {
        case 'brief':
          return {
            keyPoints: 'Mobile app beta 85% complete, usability testing positive, next sprint focuses on performance',
            actionItems: 'Edge case testing tomorrow, account settings redesign by Friday, marketing assets by Tuesday'
          };
        case 'medium':
          return {
            keyPoints: 'Mobile app beta development is 85% complete with API integration finished. Usability testing shows positive results for onboarding flow, but account settings need redesign. Next sprint will focus on performance improvements and bug fixes.',
            actionItems: 'Taylor schedules edge case testing for tomorrow, Jordan creates account settings mockup by EOD Friday, Priya provides staging build by Monday, marketing needs screenshots and feature list by Tuesday',
            decisions: 'Prioritize account settings redesign, proceed with launch campaign preparation'
          };
        case 'detailed':
          return {
            keyPoints: 'The team conducted a comprehensive Q3 roadmap review focusing on mobile app beta progress and sprint planning. Development is 85% complete with successful API integration for payments module. Usability testing revealed positive user feedback on the new onboarding flow, though 30% of users experienced difficulty locating account settings.',
            actionItems: 'Taylor will schedule comprehensive edge case testing for tomorrow, Jordan will create detailed mockups for account settings redesign by EOD Friday, Priya will deliver staging build for marketing team by Monday, Sam requires final screenshots and feature list by next Tuesday for launch campaign',
            decisions: 'Team agreed to prioritize account settings redesign based on user feedback, approved proceeding with launch campaign preparation timeline',
            participants: 'Alex (meeting lead), Priya (development), Jordan (UX/testing), Sam (marketing), Taylor (QA)',
            nextSteps: 'Follow-up meeting scheduled, action items to be shared by EOD'
          };
      }
    };

    const baseSummary = getBaseSummary(summaryLength);

    // Generate model-specific summaries
    selectedModels.forEach(modelId => {
      switch (modelId) {
        case 'gpt-4':
          testSummaries[modelId] = `**Meeting Summary - GPT-4 Analysis**

**Key Discussion Points**
${baseSummary.keyPoints}

**Action Items**
${baseSummary.actionItems}

${baseSummary.decisions ? `**Decisions Made**\n${baseSummary.decisions}\n\n` : ''}${baseSummary.participants ? `**Participants**\n${baseSummary.participants}\n\n` : ''}${baseSummary.nextSteps ? `**Next Steps**\n${baseSummary.nextSteps}` : ''}`;
          break;

        case 'claude-3-sonnet':
          testSummaries[modelId] = `**Claude 3 Sonnet Analysis**

**Executive Summary**
${baseSummary.keyPoints}

**Immediate Actions Required**
${baseSummary.actionItems}

${baseSummary.decisions ? `**Strategic Decisions**\n${baseSummary.decisions}\n\n` : ''}**Risk Assessment**
- Potential delays if edge cases reveal critical issues
- User experience risk with current account settings placement
- Timeline pressure for marketing deliverables

${baseSummary.nextSteps ? `**Follow-up Actions**\n${baseSummary.nextSteps}` : ''}`;
          break;

        case 'gemini-pro':
          testSummaries[modelId] = `**Gemini Pro Meeting Analysis**

**Progress Metrics**
- Mobile app completion: 85%
- API integration: 100% complete
- Usability testing satisfaction: 70% (account settings issue identified)

**Task Distribution**
${baseSummary.actionItems}

${baseSummary.decisions ? `**Team Decisions**\n${baseSummary.decisions}\n\n` : ''}**Timeline Overview**
- Tomorrow: Edge case testing
- Friday: Account settings mockup
- Monday: Staging build delivery
- Tuesday: Marketing assets deadline

${baseSummary.participants ? `**Meeting Attendees**\n${baseSummary.participants}` : ''}`;
          break;

        case 'llama-2-70b':
          testSummaries[modelId] = `**Llama 2 Meeting Summary**

**Main Topics Discussed**
${baseSummary.keyPoints}

**Tasks Assigned**
${baseSummary.actionItems}

${baseSummary.decisions ? `**Agreements Reached**\n${baseSummary.decisions}\n\n` : ''}**Team Collaboration Notes**
- Strong team coordination evident
- Clear ownership of tasks
- Realistic timeline setting
- Proactive issue identification

${baseSummary.nextSteps ? `**Future Actions**\n${baseSummary.nextSteps}` : ''}

**Meeting Effectiveness**: High - Clear outcomes and next steps defined`;
          break;

        default:
          testSummaries[modelId] = `**AI Analysis Summary**

**Key Points**
${baseSummary.keyPoints}

**Action Items** 
${baseSummary.actionItems}`;
      }
    });

    console.log('Summarization completed for models:', Object.keys(testSummaries));

    // Step 3: Increment user usage count
    // await incrementUserUsage(userId);

    return NextResponse.json({
      success: true,
      transcript: transcript,
      summaries: testSummaries, // Object with model IDs as keys
    });

  } catch (error) {
    console.error('Processing error:', error);
    
    // Handle specific errors
    if (error.message.includes('Usage limit reached')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
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