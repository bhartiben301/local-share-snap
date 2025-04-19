
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setIsLoading(true);
    try {
      onUpload(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      onDragOver={(e) => {
        handleDrag(e);
        setIsDragging(true);
      }}
      onDragEnter={(e) => {
        handleDrag(e);
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        handleDrag(e);
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-blue-500" />
        </div>
        <p className="mb-2 font-medium">Drag and drop a file here, or</p>
        <p className="text-sm text-gray-500 mb-4">
          Files will be shared with connected peers
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Select File'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
