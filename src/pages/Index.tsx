
import { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import Peer from 'peerjs';
import FileUpload from '../components/FileUpload';
import FileList, { FileInfo } from '../components/FileList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';

const Index = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [remotePeerId, setRemotePeerId] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer({
      // Default STUN servers to help with NAT traversal on the local network
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('open', (id) => {
      setMyPeerId(id);
      toast.success('Your peer ID is ready to share');
      console.log('My peer ID:', id);
    });

    peer.on('connection', (conn) => {
      connectionRef.current = conn;
      setConnected(true);
      toast.success('Peer connected!');

      conn.on('data', (data: any) => {
        if (data.type === 'file') {
          // Create a blob from the received data
          const blob = new Blob([data.fileData], { type: data.fileType });
          const fileUrl = URL.createObjectURL(blob);
          
          // Add to files list
          const newFile: FileInfo = {
            name: data.fileName,
            size: data.fileSize,
            type: data.fileType,
            url: fileUrl
          };
          
          setFiles(prevFiles => [...prevFiles, newFile]);
          toast.success(`Received file: ${data.fileName}`);
        }
      });

      conn.on('close', () => {
        setConnected(false);
        toast.error('Peer disconnected');
      });
    });

    peer.on('error', (err) => {
      console.error('PeerJS error:', err);
      toast.error(`Connection error: ${err.message}`);
    });

    peerRef.current = peer;

    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      peer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    if (!peerRef.current || !remotePeerId) return;
    
    const conn = peerRef.current.connect(remotePeerId);
    connectionRef.current = conn;
    
    conn.on('open', () => {
      setConnected(true);
      toast.success(`Connected to peer: ${remotePeerId}`);
    });

    conn.on('data', (data: any) => {
      if (data.type === 'file') {
        // Create a blob from the received data
        const blob = new Blob([data.fileData], { type: data.fileType });
        const fileUrl = URL.createObjectURL(blob);
        
        // Add to files list
        const newFile: FileInfo = {
          name: data.fileName,
          size: data.fileSize,
          type: data.fileType,
          url: fileUrl
        };
        
        setFiles(prevFiles => [...prevFiles, newFile]);
        toast.success(`Received file: ${data.fileName}`);
      }
    });

    conn.on('close', () => {
      setConnected(false);
      toast.error('Peer disconnected');
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      toast.error(`Connection error: ${err.message}`);
      setConnected(false);
    });
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(myPeerId);
    toast.success('Peer ID copied to clipboard');
  };

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
    
    // Share with connected peer
    if (connected && connectionRef.current) {
      // Read the file and send it
      const reader = new FileReader();
      reader.onload = () => {
        connectionRef.current.send({
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileData: reader.result
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">LAN File Sharing (P2P)</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Connection</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm mb-2">Your Peer ID:</p>
            <div className="flex space-x-2">
              <Input value={myPeerId} readOnly className="bg-gray-100" />
              <Button onClick={copyPeerId} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Share this ID with others to let them connect to you</p>
          </div>
          
          <div>
            <p className="text-sm mb-2">Connect to Peer:</p>
            <div className="flex space-x-2">
              <Input 
                value={remotePeerId} 
                onChange={(e) => setRemotePeerId(e.target.value)}
                placeholder="Enter peer ID" 
                disabled={connected}
              />
              <Button 
                onClick={connectToPeer} 
                disabled={!remotePeerId || connected}
                variant={connected ? "outline" : "default"}
              >
                {connected ? 'Connected' : 'Connect'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className={`px-3 py-1 text-sm inline-flex rounded-full ${connected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {connected ? 'Connected to peer' : 'Not connected'}
          </div>
        </div>
      </div>
      
      <FileUpload onUpload={handleFileUpload} />
      <FileList files={files} />
    </div>
  );
};

export default Index;
