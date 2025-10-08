'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isCameraLoading, setIsCameraLoading] = useState(false);
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
    setIsCameraLoading(true);
    try {

      const stream = await navigator.mediaDevices
        .getUserMedia({ video: {
                facingMode: { ideal: "environment" }
        }, audio: false });

      if (videoRef.current && stream) {
        setStream(stream);
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraLoading(false);
      } else {
        setIsCameraLoading(false);
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraLoading(false);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions dans les paramètres du navigateur.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Utiliser les dimensions réelles de la vidéo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPreview(canvas.toDataURL('image/jpeg', 0.95));
        stopCamera();
      }
    } else {
      console.error('Video not ready');
      alert('La vidéo n\'est pas encore prête. Veuillez réessayer.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraLoading(false);
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
          {!preview && !stream && !isCameraLoading && (
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

          {isCameraLoading && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <div className="text-center">
                <Camera className="mx-auto mb-2 h-8 w-8 animate-pulse" />
                <p>Chargement de la caméra...</p>
              </div>
            </div>
          )}
          <div className={cn("space-y-4", !stream && "hidden")}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded border bg-black"
                style={{ maxHeight: '60vh' }}
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
