
import React from 'react';
import { Download } from 'lucide-react';

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
}

const FileList = ({ files }: { files: FileInfo[] }) => {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Shared Files</h2>
        <div className="p-8 border border-dashed rounded-lg text-center text-gray-500">
          <p>No files shared yet</p>
          <p className="text-sm mt-2">Files you upload or receive will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Shared Files ({files.length})</h2>
      <div className="space-y-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-md text-blue-700">
                {getFileIcon(file.type)}
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatSize(file.size)} • {getFileTypeLabel(file.type)}
                </p>
              </div>
            </div>
            <a
              href={file.url}
              download={file.name}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get a friendly file type label
const getFileTypeLabel = (type: string): string => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Audio';
  if (type.startsWith('text/')) return 'Text';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('word') || type.includes('document')) return 'Document';
  if (type.includes('excel') || type.includes('sheet')) return 'Spreadsheet';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'Presentation';
  return 'File';
};

// Helper function to render an appropriate icon based on file type
const getFileIcon = (type: string): JSX.Element => {
  return <span>📄</span>; // Simple fallback icon
};

export default FileList;
