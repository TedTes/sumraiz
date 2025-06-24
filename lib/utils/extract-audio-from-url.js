import ytdl from '@distube/ytdl-core';
import tmp from 'tmp';
import fs from 'fs'; 
import fsPromises from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';

export async function extractAudioFromUrl(url, options = {}) {
  const {
    format = 'mp3',
    quality = 'high',
    maxDuration = 10800
  } = options;

  let outputFile = null;

  try {
    // Check if it's a YouTube URL
    if (!ytdl.validateURL(url)) {
      return await fallbackToDirectDownload(url, format);
    }

    outputFile = tmp.fileSync({ postfix: `.webm` }); // Use webm since that's what YouTube provides

    console.log(`🎵 Starting YouTube audio extraction:`);
    console.log(`   URL: ${url}`);
    console.log(`   Format: ${format}`);

    // Get video info with better error handling
    console.log('🔍 Getting video info...');
    let info;
    try {
      info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      });
    } catch (infoError) {
      console.error('Failed to get video info:', infoError.message);
      throw new Error(`Cannot access video: ${infoError.message}`);
    }
    
    const metadata = {
      title: info.videoDetails.title || 'Unknown Title',
      duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
      uploader: info.videoDetails.author?.name || 'Unknown',
      uploadDate: info.videoDetails.publishDate,
      description: info.videoDetails.description?.substring(0, 500) || '',
      originalUrl: url,
      thumbnail: info.videoDetails.thumbnails?.[0]?.url
    };

    console.log(`📹 Video: "${metadata.title}" by ${metadata.uploader} (${metadata.duration})`);

    // Check duration limit
    const duration = parseInt(info.videoDetails.lengthSeconds);
    if (duration && duration > maxDuration) {
      throw new Error(`Content duration (${formatDuration(duration)}) exceeds limit of ${formatDuration(maxDuration)}`);
    }

    // Get audio formats with better filtering
    console.log('🎵 Finding audio formats...');
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    
    if (audioFormats.length === 0) {
      console.warn('No audioonly formats found, trying audio from video formats...');
      const allFormats = ytdl.filterFormats(info.formats, 'audio');
      if (allFormats.length === 0) {
        throw new Error('No audio formats available for this video');
      }
      audioFormats.push(...allFormats);
    }

    // Choose best available audio format
    let bestAudio;
    try {
      bestAudio = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    } catch (formatError) {
      console.warn('Could not choose best format, using first available:', formatError.message);
      bestAudio = audioFormats[0];
    }

    console.log(`🎵 Selected audio format: ${bestAudio.container} (${bestAudio.audioBitrate || 'unknown'}kbps)`);

    // Download audio with better stream handling
    console.log('📥 Downloading audio...');
    
    try {
      const audioStream = ytdl(url, { 
        format: bestAudio,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      });
      
      const writeStream = fs.createWriteStream(outputFile.name); // ✅ Correct fs usage
      
      await pipeline(audioStream, writeStream);
      console.log('✅ Download completed');
      
    } catch (downloadError) {
      console.error('Download failed:', downloadError.message);
      throw new Error(`Download failed: ${downloadError.message}`);
    }
    
    // Read the downloaded audio
    const audioBuffer = await fsPromises.readFile(outputFile.name);
    console.log(`✅ Audio extraction completed. Size: ${Math.round(audioBuffer.length / 1024 / 1024)}MB`);

    return {
      success: true,
      audioBuffer,
      metadata
    };

  } catch (error) {
    console.error('❌ YouTube audio extraction failed:', error);
    
    // Provide more helpful error messages
    let errorMessage = error.message;
    
    if (error.message.includes('decipher') || error.message.includes('n transform')) {
      errorMessage = 'YouTube has updated their player code. This video cannot be processed right now. Please try a different video or try again later.';
    } else if (error.message.includes('unavailable')) {
      errorMessage = 'This video is unavailable, private, or region-blocked.';
    } else if (error.message.includes('formats')) {
      errorMessage = 'No downloadable audio formats found for this video.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    if (outputFile) {
      try {
        outputFile.removeCallback();
      } catch (cleanupError) {
        console.warn('⚠️ Failed to cleanup output file:', cleanupError);
      }
    }
  }
}

async function fallbackToDirectDownload(url, format) {
  try {
    console.log('📥 Attempting direct audio download...');
    
    // Check if it's a direct audio URL
    const audioExtensions = /\.(mp3|m4a|wav|aac|ogg|flac)(\?.*)?$/i;
    if (!audioExtensions.test(url)) {
      throw new Error('URL is not a YouTube URL or direct audio file. Only YouTube and direct audio URLs are supported.');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AudioExtractor/1.0)',
        'Accept': 'audio/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      throw new Error('File too large (>50MB) for processing');
    }

    const buffer = await response.arrayBuffer();
    
    const metadata = {
      title: path.basename(url, path.extname(url)),
      duration: null,
      format: contentType,
      size: contentLength,
      originalUrl: url
    };

    console.log('✅ Direct download completed');
    
    return {
      success: true,
      audioBuffer: Buffer.from(buffer),
      metadata
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export function isSupportedUrl(url) {
  try {
    // Check if it's a YouTube URL
    if (ytdl.validateURL(url)) {
      return true;
    }
    
    // Check if it's a direct audio file
    const audioExtensions = /\.(mp3|m4a|wav|aac|ogg|flac)(\?.*)?$/i;
    const urlObj = new URL(url);
    return audioExtensions.test(urlObj.pathname);
  } catch (error) {
    return false;
  }
}

export default extractAudioFromUrl;