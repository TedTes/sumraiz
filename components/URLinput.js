
import { useState, useEffect } from 'react';

export  function URLinput({isProcessing,selectedModels,   onUrlSubmit}) {
    const [urlInput, setUrlInput] = useState('');
    const [urlError, setUrlError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const validateUrl = (url) => {
        try {
          const urlObj = new URL(url);
          
          // Check if it's a valid HTTP/HTTPS URL
          if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
          }
          
          // YouTube URL patterns
          const youtubePatterns = [
            /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
            /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
            /^https?:\/\/youtu\.be\/[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/live\/[\w-]+/
          ];
          
          // Other supported video platforms
          const supportedPlatforms = [
            /^https?:\/\/(www\.)?(vimeo\.com)\/.+/,
            /^https?:\/\/(www\.)?(dailymotion\.com)\/.+/,
            /^https?:\/\/(www\.)?(twitch\.tv)\/.+/,
            /^https?:\/\/(www\.)?(soundcloud\.com)\/.+/,
            /^https?:\/\/(www\.)?(spotify\.com)\/.+/
          ];
          
          // Direct media file extensions
          const mediaExtensions = /\.(mp3|mp4|wav|m4a|webm|mov|avi|mkv|flv)(\?.*)?$/i;
          
          const isYoutube = youtubePatterns.some(pattern => pattern.test(url));
          const isSupportedPlatform = supportedPlatforms.some(pattern => pattern.test(url));
          const isDirectMedia = mediaExtensions.test(urlObj.pathname);
          
          if (isYoutube) {
            return { isValid: true, platform: 'YouTube' };
          } else if (isSupportedPlatform) {
            const platform = supportedPlatforms.find(pattern => pattern.test(url));
            const platformName = url.includes('vimeo') ? 'Vimeo' :
                               url.includes('dailymotion') ? 'Dailymotion' :
                               url.includes('twitch') ? 'Twitch' :
                               url.includes('soundcloud') ? 'SoundCloud' :
                               url.includes('spotify') ? 'Spotify' : 'Supported platform';
            return { isValid: true, platform: platformName };
          } else if (isDirectMedia) {
            return { isValid: true, platform: 'Direct media file' };
          } else {
            return { 
              isValid: false, 
              error: 'Unsupported platform. Please use YouTube, Vimeo, SoundCloud, or direct media file URLs' 
            };
          }
          
        } catch (error) {
          return { isValid: false, error: 'Invalid URL format' };
        }
      };

  //URL input handler with real-time validation
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    
    // Clear previous error
    setUrlError('');
    
    // Only validate if there's actual input and it looks like a URL
    if (newUrl.trim() && (newUrl.includes('http') || newUrl.includes('www') || newUrl.includes('.'))) {
      const validation = validateUrl(newUrl.trim());
      if (!validation.isValid) {
        setUrlError(validation.error);
      }
    }
  };

  const handleUrlSubmit = async () => {
    const trimmedUrl = urlInput.trim();
    
    if (!trimmedUrl) {
      setUrlError('Please enter a URL');
      return;
    }
    
    if (selectedModels.length === 0) {
      setUrlError('Please select at least one AI model');
      return;
    }
    
    setIsValidating(true);
    setUrlError('');
    
    // Validate URL
    const validation = validateUrl(trimmedUrl);
    
    if (!validation.isValid) {
      setUrlError(validation.error);
      setIsValidating(false);
      return;
    }

    try {
      await onUrlSubmit(trimmedUrl, 'media');
      setUrlInput('');
      setUrlError('');
    } catch (error) {
      setUrlError('Failed to process URL. Please check the link and try again.');
    } finally {
      setIsValidating(false);
    }
  };

    // Get validation status for styling
const getInputStyles = () => {
        const baseStyles = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";
        
        if (urlError) {
          return `${baseStyles} border-red-300 bg-red-50 focus:ring-red-500`;
        } else if (urlInput.trim() && !urlError) {
          const validation = validateUrl(urlInput.trim());
          if (validation.isValid) {
            return `${baseStyles} border-green-300 bg-green-50 focus:ring-green-500`;
          }
        }
        
        return `${baseStyles} border-gray-300`;
      };

        // Get button state
const isButtonDisabled = !urlInput.trim() || isProcessing || selectedModels.length === 0 || !!urlError || isValidating;
    return     <div className="mb-6">
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="Paste YouTube URL or media link..."
            className={getInputStyles()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isButtonDisabled) {
                handleUrlSubmit();
              }
            }}
          />
          
          {/* Validation Icons */}
          {urlInput.trim() && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidating ? (
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : urlError ? (
                <span className="text-red-500 text-lg">❌</span>
              ) : (
                (() => {
                  const validation = validateUrl(urlInput.trim());
                  return validation.isValid ? (
                    <span className="text-green-500 text-lg">✅</span>
                  ) : null;
                })()
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={handleUrlSubmit}
          disabled={isButtonDisabled}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : isValidating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Validating...
            </>
          ) : (
            'Process URL'
          )}
        </button>
      </div>
      
      {/* Error Message */}
      {urlError && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in-up">
          <span>⚠️</span>
          <span>{urlError}</span>
        </div>
      )}
      
      {/* Success Message with Platform Detection */}
      {urlInput.trim() && !urlError && (() => {
        const validation = validateUrl(urlInput.trim());
        return validation.isValid ? (
          <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in-up">
            <span>✅</span>
            <span>Valid {validation.platform} URL detected</span>
          </div>
        ) : null;
      })()}
      
      {/* Supported Platforms Info */}
      <div className="text-xs text-gray-500">
        <strong>Supported:</strong> YouTube, Vimeo, SoundCloud, Spotify, Dailymotion, Twitch, and direct media files (MP3, MP4, WAV, etc.)
      </div>
    </div>
  </div>
}