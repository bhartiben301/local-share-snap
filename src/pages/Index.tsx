
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from "sonner";
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

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error("Connection error. Running in local mode.");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileUpload = (file: File) => {
    // Create a local file URL
    const fileUrl = URL.createObjectURL(file);
    
    // Create a new file object
    const newFile: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl
    };
    
    // Update local state immediately
    setFiles(prevFiles => [...prevFiles, newFile]);
    toast.success(`File "${file.name}" uploaded successfully!`);
    
    // Still try to send to server if connected
    try {
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
    } catch (error) {
      console.error('Error processing file:', error);
    }
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
