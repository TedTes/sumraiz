'use client';

import { useState, useRef } from 'react';
import { Upload, FileAudio, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, isProcessing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && isAudioFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert('Please select a valid audio file (MP3, M4A, WAV, or WebM)');
    }
  };

  const isAudioFile = (file) => {
    const audioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/webm'];
    return audioTypes.includes(file.type) || file.name.match(/\.(mp3|m4a|wav|webm)$/i);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
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
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-primary-100 p-6 rounded-2xl">
              <Upload className="h-16 w-16 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                Drop your meeting recording here
              </p>
              <p className="text-gray-500">
                or click to browse files
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">
                Supports MP3, M4A, WAV, WebM • Max 50MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      ) : (
        <div className="file-display">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-4 rounded-xl">
              <FileAudio className="h-8 w-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus-ring"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}