'use client'
import { useState, useRef, useEffect, useContext } from "react"
import { SocketContext } from "./socketProvider";


export default function Home() {
  const socket = useContext(SocketContext);
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(true);


  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  }, [stream]);

  const shareScreen = async () => {
    if (!socket) alert('Socket not connected');

    if (socket?.readyState !== WebSocket.OPEN) {
      alert('Socket not connected');
    }

    socket?.send(JSON.stringify({ type: 'share-screen' }))
  }

  const onClick = async () => {
    setOpen(!open)

    if (open) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720, frameRate: { ideal: 60, max: 60, min: 30 } }
      });

      setStream(stream)
    }

    if (!open) {
      setStream(null)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="flex justify-between gap-2">
        <button className="border-red-500 border-2 p-2 rounded-lg" onClick={onClick}>
          Open Camera
        </button>
        <button className="border-red-500 border-2 p-2 rounded-lg" onClick={shareScreen}>
          Share Screen
        </button>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline />
    </main>
  )
}