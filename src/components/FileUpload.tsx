
import React, { useState, useRef } from 'react';

const FileUpload = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
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
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      className={`p-8 border-2 border-dashed rounded-lg ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
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
        <p className="mb-4">Drag and drop a file here, or</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select File
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
