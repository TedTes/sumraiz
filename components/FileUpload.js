'use client';

import { useState, useRef } from 'react';
import { Upload, FileAudio, X, CheckCircle2 } from 'lucide-react';

export default function FileUpload({ onFileSelect, isProcessing ,acceptedTypes,placeholderText}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setUploadSuccess(true);
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
    setUploadSuccess(false);
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

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const audioFormats = ['mp3', 'm4a', 'wav', 'webm'];
    const videoFormats = ['mp4', 'mov', 'avi'];
    
    if (audioFormats.includes(extension)) return '🎵';
    if (videoFormats.includes(extension)) return '🎥';
    return '📁';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group
            ${dragOver ? 'border-indigo-400 bg-indigo-50 scale-105' : 'border-gray-300'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-300 hover:bg-gray-50 hover:scale-102'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className={`p-6 rounded-3xl transition-all duration-300 ${
              dragOver ? 'bg-indigo-200 scale-110' : 'bg-indigo-100 group-hover:bg-indigo-200 group-hover:scale-105'
            }`}>
              <Upload className={`h-16 w-16 transition-colors duration-300 ${
                dragOver ? 'text-indigo-700' : 'text-indigo-600'
              }`} />
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {placeholderText}
              </h3>
              <p className="text-lg text-gray-600">
                or click to browse files
              </p>
              
              {/* Enhanced file type display */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {acceptedTypes.map((format) => (
                  <span key={format} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {format}
                  </span>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mt-4">
                <p className="text-sm text-blue-800 font-medium">
                  Maximum file size: 50MB
                </p>
              </div>
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
        <div className={`bg-white border-2 rounded-2xl p-6 shadow-lg transition-all duration-300 ${
          uploadSuccess ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${
              uploadSuccess ? 'bg-green-100' : 'bg-indigo-100'
            }`}>
              <FileAudio className={`h-8 w-8 ${
                uploadSuccess ? 'text-green-600' : 'text-indigo-600'
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
                <h4 className="font-bold text-gray-900 text-lg">{selectedFile.name}</h4>
                {uploadSuccess && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Ready for processing</span>
                </span>
              </div>
            </div>
            
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl focus:ring-2 focus:ring-red-300 group"
                title="Remove file"
              >
                <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
          </div>
          
          {/* File preview info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700 font-medium">
                File uploaded successfully! Click "Process" to continue.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}