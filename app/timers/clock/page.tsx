'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

export default function ClockTimerPage() {
  const [totalTime, setTotalTime] = useState(50 * 60); // 50 minutes in seconds
  const [currentTime, setCurrentTime] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(50);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentTime(totalTime);
  }, [totalTime]);

  const handleSetTime = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    setTotalTime(seconds);
    setInputMinutes(minutes);
    if (!isRunning) {
      setCurrentTime(seconds);
    }
  }, [isRunning]);

  const addTime = useCallback((minutes: number) => {
    setCurrentTime((prev) => prev + minutes * 60);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((totalTime - currentTime) / totalTime) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Timer de Ronde</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="duration">Durée de la ronde (minutes)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="duration"
                  type="number"
                  value={inputMinutes}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 50;
                    setInputMinutes(value);
                  }}
                  min={1}
                  max={180}
                  disabled={isRunning}
                />
                <Button
                  onClick={() => handleSetTime(inputMinutes)}
                  disabled={isRunning}
                >
                  Appliquer
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSetTime(30)}
                disabled={isRunning}
                className="flex-1"
              >
                30 min
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSetTime(50)}
                disabled={isRunning}
                className="flex-1"
              >
                50 min
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSetTime(60)}
                disabled={isRunning}
                className="flex-1"
              >
                60 min
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
              <div className={`text-7xl font-bold ${currentTime <= 300 && currentTime > 0 ? 'text-orange-500' : ''} ${currentTime <= 60 && currentTime > 0 ? 'text-red-500 animate-pulse' : ''}`}>
                {formatTime(currentTime)}
              </div>
              <div className="mt-4 w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
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

            {isRunning && (
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => addTime(1)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-1 h-4 w-4" /> 1 min
                </Button>
                <Button
                  onClick={() => addTime(5)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-1 h-4 w-4" /> 5 min
                </Button>
                <Button
                  onClick={() => addTime(-1)}
                  variant="outline"
                  size="sm"
                  disabled={currentTime < 60}
                >
                  <Minus className="mr-1 h-4 w-4" /> 1 min
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
