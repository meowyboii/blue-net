"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Rewind,
  FastForward,
} from "lucide-react";
import { WaveSurferOptions } from "wavesurfer.js";
import { useWavesurfer } from "@wavesurfer/react";

// Define the props for the WaveSurfer component
interface WaveSurferPlayerProps {
  options: Omit<WaveSurferOptions, "container">;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({ options }: WaveSurferPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    ...options,
    height: 80,
    waveColor: "rgb(200, 200, 200)",
    progressColor: "rgb(53, 114, 213)",
  });

  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const onPlay = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.play();
    }
  }, [wavesurfer]);

  const onVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (wavesurfer) {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        wavesurfer.setVolume(newVolume);
        setIsMuted(newVolume === 0);
      }
    },
    [wavesurfer]
  );

  const onMuteToggle = useCallback(() => {
    if (wavesurfer) {
      if (isMuted) {
        wavesurfer.setVolume(volume || 1);
        setIsMuted(false);
      } else {
        wavesurfer.setVolume(0);
        setIsMuted(true);
      }
    }
  }, [wavesurfer, isMuted, volume]);

  const onSkip = useCallback(
    (amount: number) => {
      if (wavesurfer) {
        wavesurfer.skip(amount);
      }
    },
    [wavesurfer]
  );

  useEffect(() => {
    if (!wavesurfer) return;

    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("audioprocess", (time) => setCurrentTime(time)),
      wavesurfer.on("ready", (newDuration) => setDuration(newDuration)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  return (
    <div className="rounded-lg p-4 w-full max-w-2xl mx-auto">
      <div
        ref={containerRef}
        onClick={onPlay}
        className="opacity-70 hover:opacity-100 transition cursor-pointer"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="text-white text-sm w-16 text-center">
          {formatTime(currentTime)}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onSkip(-5)}
            className="text-white hover:text-gray-400 cursor-pointer"
          >
            <Rewind size={24} />
          </button>
          <button
            onClick={onPlayPause}
            className=" text-foreground rounded-full p-3 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button
            onClick={() => onSkip(5)}
            className="text-white hover:text-gray-400 cursor-pointer"
          >
            <FastForward size={24} />
          </button>
        </div>

        <div className="text-white text-sm w-16 text-center">
          {formatTime(duration)}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={onMuteToggle}
          className="text-white hover:text-gray-400"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
