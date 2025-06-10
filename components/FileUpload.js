'use client';

import { useState, useRef } from 'react';
import { Upload, FileAudio, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, isProcessing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert('Please select a valid audio/video file (MP3, M4A, WAV, WebM, MP4) under 50MB');
    }
  };

  const isValidFile = (file) => {
    const allowedTypes = [
      'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/webm',
      'video/mp4', 'video/mov', 'video/avi', 'video/webm'
    ];
    const isValidType = allowedTypes.includes(file.type) || 
                       file.name.match(/\.(mp3|m4a|wav|webm|mp4|mov|avi)$/i);
    const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
    return isValidType && isValidSize;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-300 hover:bg-gray-50'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-primary-100 p-4 rounded-2xl">
              <Upload className="h-12 w-12 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Drop your meeting recording here
              </p>
              <p className="text-gray-600">
                or click to browse files
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">
                Supports MP3, M4A, WAV, WebM, MP4 • Max 50MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-xl">
              <FileAudio className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-600 mt-1">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-primary-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}