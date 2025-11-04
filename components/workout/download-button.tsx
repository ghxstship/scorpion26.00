"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Loader2, Check } from "lucide-react";
import { estimateDownloadSize, formatFileSize } from "@/lib/video/video-utils";
import { cn } from "@/lib/utils";

export interface DownloadButtonProps {
  workoutId: string;
  videoUrl: string;
  duration: number;
  className?: string;
}

const QUALITY_OPTIONS = [
  { value: "1080p", label: "1080p (HD)" },
  { value: "720p", label: "720p" },
  { value: "540p", label: "540p" },
  { value: "360p", label: "360p" },
];

export function DownloadButton({
  workoutId,
  videoUrl,
  duration,
  className,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async (quality: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Register download in database
      const response = await fetch("/api/workouts/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutId,
          quality,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register download");
      }

      // In a real implementation, this would:
      // 1. Use Service Worker to cache the video
      // 2. Show real download progress
      // 3. Store metadata in IndexedDB
      
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setDownloadProgress(i);
      }

      setIsDownloaded(true);
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-white hover:bg-white/20",
            isDownloaded && "bg-white/10",
            className
          )}
          title="Download for offline viewing"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isDownloaded ? (
            <Check className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
        <div className="px-2 py-1.5 text-xs text-white/70 font-medium">
          Download Quality
        </div>
        {QUALITY_OPTIONS.map((option) => {
          const estimatedSize = estimateDownloadSize(duration, option.value);
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleDownload(option.value)}
              className="text-white hover:bg-white/20 cursor-pointer flex items-center justify-between"
              disabled={isDownloading}
            >
              <span>{option.label}</span>
              <span className="text-xs text-white/50 ml-4">
                ~{estimatedSize} MB
              </span>
            </DropdownMenuItem>
          );
        })}
        {isDownloading && (
          <div className="px-2 py-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white mb-1">
              <span>Downloading...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
