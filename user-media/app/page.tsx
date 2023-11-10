'use client'
import { useState, useRef, useEffect, useContext } from "react"
import { WSStateContext } from "./socketProvider";


export default function Home() {
  const socket = useContext(WSStateContext);
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

  useEffect(() => {
    if (socket?.active) {
      socket.on('stream', (data) => {
        const { type } = JSON.parse(data);
        if (type === 'share-screen') {
          navigator.mediaDevices.getDisplayMedia({
            video: { width: 1280, height: 720, frameRate: { ideal: 60, max: 60, min: 30 } }
          }).then((screenStream) => {
            setStream(screenStream)
          })
        }
      });
    }
  }, [socket]);

  function shareScreen() {
    if (socket?.active) {
      socket.emit('stream', JSON.stringify({ type: 'share-screen' }));
    }
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