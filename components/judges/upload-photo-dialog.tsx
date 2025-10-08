'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';

interface UploadPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  playerId: string;
  type: 'pool' | 'decklist';
  onSuccess: () => void;
}

export function UploadPhotoDialog({
  open,
  onOpenChange,
  eventId,
  playerId,
  type,
  onSuccess,
}: UploadPhotoDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Impossible d\'accéder à la caméra');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setPreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(preview);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, 'photo.jpg');
      formData.append('type', type);

      const uploadResponse = await fetch(
        `/api/judges/events/${eventId}/players/${playerId}/photos`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        onSuccess();
        onOpenChange(false);
        setPreview(null);
      } else {
        alert('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          stopCamera();
          setPreview(null);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {type === 'pool' ? 'Photo du pool' : 'Photo de la decklist'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!preview && !stream && (
            <div className="flex gap-2">
              <Button onClick={startCamera} className="flex-1">
                <Camera className="mr-2" />
                Prendre une photo
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="mr-2" />
                Choisir un fichier
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {stream && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded border"
              />
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  Capturer
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {preview && (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded border"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Upload...' : 'Enregistrer'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreview(null)}
                  disabled={isUploading}
                >
                  Reprendre
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
