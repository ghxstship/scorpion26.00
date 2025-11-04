"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { VideoControls } from "./video-controls";
import { VideoProgressBar } from "./video-progress-bar";
import { CaptionSelector } from "./caption-selector";
import { DownloadButton } from "./download-button";
import {
  formatTime,
  isVideoCompleted,
  supportsNativeHLS,
  supportsPictureInPicture,
  supportsFullscreen,
  requestFullscreen,
  exitFullscreen,
  isFullscreen,
  requestPictureInPicture,
  exitPictureInPicture,
  debounce,
} from "@/lib/video/video-utils";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface VideoPlayerProps {
  workoutId: string;
  videoUrl: string; // HLS manifest URL
  thumbnailUrl?: string;
  captions?: Array<{
    id: string;
    language: string;
    languageName: string;
    url: string;
    isDefault?: boolean;
  }>;
  initialProgress?: number; // Resume from this position (seconds)
  onProgressUpdate?: (progress: number, duration: number) => void;
  onComplete?: () => void;
  className?: string;
  autoPlay?: boolean;
  allowDownload?: boolean;
}

export function VideoPlayer({
  workoutId,
  videoUrl,
  thumbnailUrl,
  captions = [],
  initialProgress = 0,
  onProgressUpdate,
  onComplete,
  className,
  autoPlay = false,
  allowDownload = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreenState, setIsFullscreenState] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(
    captions.find((c) => c.isDefault)?.id || null
  );
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string>("auto");

  // Debounced progress save
  const debouncedProgressUpdate = useCallback(
    (time: number, dur: number) => {
      const debouncedFn = debounce(() => {
        if (onProgressUpdate) {
          onProgressUpdate(time, dur);
        }
      }, 5000);
      debouncedFn();
    },
    [onProgressUpdate]
  );

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const initPlayer = () => {
      // Check if browser supports HLS natively (Safari)
      if (supportsNativeHLS() && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        setIsLoading(false);
      } else if (Hls.isSupported()) {
        // Use HLS.js for other browsers
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
        });

        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          setIsLoading(false);
          
          // Extract available quality levels
          const qualities = data.levels.map((level) => {
            const height = level.height;
            if (height >= 1080) return "1080p";
            if (height >= 720) return "720p";
            if (height >= 540) return "540p";
            if (height >= 360) return "360p";
            return "240p";
          });
          
          setAvailableQualities(["auto", ...qualities]);
          
          // Auto-play if enabled
          if (autoPlay) {
            video.play().catch((err) => {
              console.error("Auto-play failed:", err);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError("Network error - please check your connection");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Media error - trying to recover");
                hls.recoverMediaError();
                break;
              default:
                setError("Fatal error - cannot play video");
                break;
            }
          }
        });
      } else {
        setError("Your browser does not support HLS video playback");
      }
    };

    initPlayer();

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const intervalId = progressIntervalRef.current;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [videoUrl, autoPlay]);

  // Resume from initial progress
  useEffect(() => {
    const video = videoRef.current;
    if (video && initialProgress > 0 && duration > 0) {
      video.currentTime = initialProgress;
    }
  }, [initialProgress, duration]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      debouncedProgressUpdate(video.currentTime, video.duration);
      
      // Check if video is completed
      if (isVideoCompleted(video.currentTime, video.duration) && onComplete) {
        onComplete();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleRateChange = () => setPlaybackRate(video.playbackRate);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => setError("Failed to load video");

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [debouncedProgressUpdate, onComplete]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenState(isFullscreen());
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Picture-in-Picture handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);

    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(-0.1);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          e.preventDefault();
          const percent = parseInt(e.key) * 10;
          seekToPercent(percent);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchstart", handleMouseMove);
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchstart", handleMouseMove);
      }
    };
  }, [isPlaying]);

  // Control functions
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, time));
  };

  const seekToPercent = (percent: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    video.currentTime = (video.duration * percent) / 100;
  };

  const changeVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(1, video.volume + delta));
  };

  const setVolumeLevel = (level: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(1, level));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (isFullscreenState) {
      await exitFullscreen();
    } else {
      await requestFullscreen(container);
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video || !supportsPictureInPicture()) return;

    if (isPiP) {
      await exitPictureInPicture();
    } else {
      await requestPictureInPicture(video);
    }
  };

  const changeQuality = (quality: string) => {
    const hls = hlsRef.current;
    if (!hls) return;

    if (quality === "auto") {
      hls.currentLevel = -1; // Auto quality
    } else {
      const levelIndex = hls.levels.findIndex((level) => {
        const height = level.height;
        const qualityHeight = parseInt(quality);
        return height === qualityHeight;
      });
      
      if (levelIndex !== -1) {
        hls.currentLevel = levelIndex;
      }
    }
    
    setCurrentQuality(quality);
  };

  const handleCaptionChange = (captionId: string | null) => {
    const video = videoRef.current;
    if (!video) return;

    // Disable all tracks
    Array.from(video.textTracks).forEach((track) => {
      track.mode = "disabled";
    });

    // Enable selected track
    if (captionId) {
      const track = Array.from(video.textTracks).find(
        (t) => t.language === captionId
      );
      if (track) {
        track.mode = "showing";
      }
    }

    setSelectedCaption(captionId);
  };

  if (error) {
    return (
      <div className={cn("relative bg-black rounded-lg overflow-hidden", className)}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center text-white p-6">
            <p className="text-lg font-semibold mb-2">Video Error</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        isFullscreenState && "rounded-none",
        className
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={thumbnailUrl}
        playsInline
        preload="metadata"
        onClick={togglePlayPause}
      >
        {captions.map((caption) => (
          <track
            key={caption.id}
            kind="subtitles"
            src={caption.url}
            srcLang={caption.language}
            label={caption.languageName}
            default={caption.isDefault}
          />
        ))}
      </video>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {captions.length > 0 && (
              <CaptionSelector
                captions={captions}
                selectedCaption={selectedCaption}
                onCaptionChange={handleCaptionChange}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {allowDownload && (
              <DownloadButton
                workoutId={workoutId}
                videoUrl={videoUrl}
                duration={duration}
              />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <VideoProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            playbackRate={playbackRate}
            isFullscreen={isFullscreenState}
            isPiP={isPiP}
            availableQualities={availableQualities}
            currentQuality={currentQuality}
            onPlayPause={togglePlayPause}
            onSkip={skip}
            onVolumeChange={setVolumeLevel}
            onMuteToggle={toggleMute}
            onPlaybackRateChange={changePlaybackRate}
            onFullscreenToggle={toggleFullscreen}
            onPiPToggle={togglePictureInPicture}
            onQualityChange={changeQuality}
            supportsPiP={supportsPictureInPicture()}
            supportsFullscreen={supportsFullscreen()}
          />
        </div>
      </div>
    </div>
  );
}
