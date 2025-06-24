import React, { useState } from 'react';
import { X, FileAudio, Play, AlertCircle } from 'lucide-react';

// Confirmation Modal Component
export const FileConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  file, 
  selectedModels, 
  summaryLength 
}) => {
  if (!isOpen || !file) return null;

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

  const getEstimatedTime = () => {
    if (selectedModels.length > 1) return '3-5 minutes';
    return '2-3 minutes';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileAudio className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Processing</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Info */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{getFileIcon(file.name)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">{file.name}</h4>
                <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
              </div>
            </div>
          </div>

          {/* Processing Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Processing Settings</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-600">📊</span>
                  <span className="text-sm font-medium text-emerald-800">
                    {summaryLength === 'brief' ? 'Quick Brief' : 
                     summaryLength === 'medium' ? 'Balanced' : 'Comprehensive'} Summary
                  </span>
                </div>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-600">🤖</span>
                  <span className="text-sm font-medium text-indigo-800">
                    {selectedModels.length} AI Model{selectedModels.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">⏱️</span>
                  <span className="text-sm font-medium text-blue-800">
                    Est. {getEstimatedTime()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning if no models selected */}
          {selectedModels.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Please select at least one AI model to proceed
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={selectedModels.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Processing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};