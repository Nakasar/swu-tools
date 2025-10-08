'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload } from 'lucide-react';

interface AddDeckCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  playerId: string;
  onSuccess: () => void;
}

export function AddDeckCheckDialog({
  open,
  onOpenChange,
  eventId,
  playerId,
  onSuccess,
}: AddDeckCheckDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
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

  const handleSubmit = async () => {
    if (!preview) {
      alert('Veuillez prendre ou choisir une photo');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(preview);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, 'deckcheck.jpg');
      formData.append('notes', notes);

      const uploadResponse = await fetch(
        `/api/judges/events/${eventId}/players/${playerId}/deckchecks`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        setNotes('');
        setPreview(null);
        onSuccess();
        onOpenChange(false);
      } else {
        alert('Erreur lors de l\'ajout du deck check');
      }
    } catch (error) {
      console.error('Error adding deck check:', error);
      alert('Erreur lors de l\'ajout du deck check');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          stopCamera();
          setPreview(null);
          setNotes('');
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un Deck Check</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes sur le deck check..."
              rows={3}
            />
          </div>

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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Ajout...' : 'Enregistrer'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreview(null)}
                  disabled={isSubmitting}
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
