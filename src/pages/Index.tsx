
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import FileUpload from '../components/FileUpload';
import FileList, { FileInfo } from '../components/FileList';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false
});

const Index = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on('files', (updatedFiles: FileInfo[]) => {
      setFiles(updatedFiles);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('upload', {
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">LAN File Sharing</h1>
      <FileUpload onUpload={handleFileUpload} />
      <FileList files={files} />
    </div>
  );
};

export default Index;
