'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Volume2, VolumeOff } from 'lucide-react';

export default function DraftTimerPage() {
  const [timePerPick, setTimePerPick] = useState(60); // seconds
  const [currentTime, setCurrentTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [pickNumber, setPickNumber] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            if (soundEnabled) {
              // Play sound when timer ends
              const audio = new Audio('/notification.mp3');
              audio.play().catch(() => {});
            }
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, currentTime, soundEnabled]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentTime(timePerPick);
  }, [timePerPick]);

  const handleNextPick = useCallback(() => {
    setPickNumber((prev) => prev + 1);
    setCurrentTime(timePerPick);
    setIsRunning(true);
  }, [timePerPick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Timer de Draft</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timePerPick">Temps par pick (secondes)</Label>
              <Input
                id="timePerPick"
                type="number"
                value={timePerPick}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 60;
                  setTimePerPick(value);
                  if (!isRunning) {
                    setCurrentTime(value);
                  }
                }}
                min={10}
                max={300}
                disabled={isRunning}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Son d&apos;alerte</Label>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 /> : <VolumeOff />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Pick #{pickNumber}
              </div>
              <div className={`text-6xl font-bold ${currentTime <= 10 && currentTime > 0 ? 'text-red-500 animate-pulse' : ''}`}>
                {formatTime(currentTime)}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg">
                  <Play className="mr-2" /> Démarrer
                </Button>
              ) : (
                <Button onClick={handlePause} variant="secondary" size="lg">
                  <Pause className="mr-2" /> Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="mr-2" /> Reset
              </Button>
            </div>

            <Button 
              onClick={handleNextPick} 
              className="w-full"
              variant="default"
              size="lg"
            >
              Pick suivant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
