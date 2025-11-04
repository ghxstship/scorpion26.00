"use client";

import { useRef, useState, MouseEvent, TouchEvent } from "react";
import { formatTime } from "@/lib/video/video-utils";
import { cn } from "@/lib/utils";

export interface VideoProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  buffered?: TimeRanges;
  className?: string;
}

export function VideoProgressBar({
  currentTime,
  duration,
  onSeek,
  buffered,
  className,
}: VideoProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const calculateTimeFromPosition = (clientX: number): number => {
    if (!progressRef.current) return 0;

    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return position * duration;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const time = calculateTimeFromPosition(e.clientX);
    setHoverTime(time);

    if (isDragging) {
      onSeek(time);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const time = calculateTimeFromPosition(e.clientX);
    onSeek(time);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const time = calculateTimeFromPosition(touch.clientX);
    onSeek(time);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = e.touches[0];
      const time = calculateTimeFromPosition(touch.clientX);
      onSeek(time);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate buffered ranges
  const getBufferedRanges = (): Array<{ start: number; end: number }> => {
    if (!buffered || !duration) return [];

    const ranges: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < buffered.length; i++) {
      ranges.push({
        start: (buffered.start(i) / duration) * 100,
        end: (buffered.end(i) / duration) * 100,
      });
    }
    return ranges;
  };

  const bufferedRanges = getBufferedRanges();
  const hoverPosition = hoverTime !== null && duration > 0 
    ? (hoverTime / duration) * 100 
    : null;

  return (
    <div className={cn("relative", className)}>
      {/* Hover Time Tooltip */}
      {hoverTime !== null && hoverPosition !== null && (
        <div
          className="absolute bottom-full mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded pointer-events-none whitespace-nowrap"
          style={{
            left: `${hoverPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        ref={progressRef}
        className="relative h-1 bg-white/30 rounded-full cursor-pointer group hover:h-1.5 transition-all"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Buffered Ranges */}
        {bufferedRanges.map((range, index) => (
          <div
            key={index}
            className="absolute h-full bg-white/50 rounded-full"
            style={{
              left: `${range.start}%`,
              width: `${range.end - range.start}%`,
            }}
          />
        ))}

        {/* Progress */}
        <div
          className="absolute h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />

        {/* Scrubber */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all",
            "opacity-0 group-hover:opacity-100",
            isDragging && "opacity-100 scale-125"
          )}
          style={{
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Hover Indicator */}
        {hoverPosition !== null && !isDragging && (
          <div
            className="absolute top-0 w-0.5 h-full bg-white/50"
            style={{ left: `${hoverPosition}%` }}
          />
        )}
      </div>
    </div>
  );
}
