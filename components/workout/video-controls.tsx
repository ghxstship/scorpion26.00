"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
  PictureInPicture,
} from "lucide-react";
import { formatTime, formatPlaybackSpeed, getPlaybackSpeeds } from "@/lib/video/video-utils";
import { cn } from "@/lib/utils";

export interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  availableQualities: string[];
  currentQuality: string;
  onPlayPause: () => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onFullscreenToggle: () => void;
  onPiPToggle: () => void;
  onQualityChange: (quality: string) => void;
  supportsPiP: boolean;
  supportsFullscreen: boolean;
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  isPiP,
  availableQualities,
  currentQuality,
  onPlayPause,
  onSkip,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
  onFullscreenToggle,
  onPiPToggle,
  onQualityChange,
  supportsPiP,
  supportsFullscreen,
}: VideoControlsProps) {
  const playbackSpeeds = getPlaybackSpeeds();

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left Controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>

        {/* Skip Backward */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSkip(-10)}
          className="text-white hover:bg-white/20"
          title="Skip backward 10s"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        {/* Skip Forward */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSkip(10)}
          className="text-white hover:bg-white/20"
          title="Skip forward 10s"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 group">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMuteToggle}
            className="text-white hover:bg-white/20"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          
          <div className="w-0 group-hover:w-24 transition-all duration-200 overflow-hidden">
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Time Display */}
        <div className="text-white text-sm font-medium whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Playback Speed */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 text-xs"
            >
              {formatPlaybackSpeed(playbackRate)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
            {playbackSpeeds.map((speed) => (
              <DropdownMenuItem
                key={speed}
                onClick={() => onPlaybackRateChange(speed)}
                className={cn(
                  "text-white hover:bg-white/20 cursor-pointer",
                  speed === playbackRate && "bg-white/10"
                )}
              >
                {formatPlaybackSpeed(speed)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quality Selector */}
        {availableQualities.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                title="Quality"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
              {availableQualities.map((quality) => (
                <DropdownMenuItem
                  key={quality}
                  onClick={() => onQualityChange(quality)}
                  className={cn(
                    "text-white hover:bg-white/20 cursor-pointer",
                    quality === currentQuality && "bg-white/10"
                  )}
                >
                  {quality === "auto" ? "Auto" : quality}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Picture-in-Picture */}
        {supportsPiP && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPiPToggle}
            className={cn(
              "text-white hover:bg-white/20",
              isPiP && "bg-white/10"
            )}
            title="Picture-in-Picture"
          >
            <PictureInPicture className="w-5 h-5" />
          </Button>
        )}

        {/* Fullscreen */}
        {supportsFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreenToggle}
            className="text-white hover:bg-white/20"
            title="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
