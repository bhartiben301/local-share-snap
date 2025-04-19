
import React from 'react';

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

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Shared Files</h2>
      <div className="space-y-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {formatSize(file.size)} • {file.type}
              </p>
            </div>
            <a
              href={file.url}
              download={file.name}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
