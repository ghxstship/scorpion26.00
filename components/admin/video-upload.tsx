"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, XCircle, Loader2, Video } from "lucide-react";
import { formatFileSize, isValidVideoFile, isValidVideoSize } from "@/lib/video/video-utils";
import { cn } from "@/lib/utils";

export interface VideoUploadProps {
  workoutId: string;
  workoutTitle: string;
  onUploadComplete?: (videoId: string) => void;
  onUploadError?: (error: string) => void;
}

type UploadStatus = "idle" | "uploading" | "processing" | "complete" | "error";

export function VideoUpload({
  workoutId,
  workoutTitle,
  onUploadComplete,
  onUploadError,
}: VideoUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidVideoFile(file)) {
      setError("Invalid file type. Please upload a video file (MP4, MOV, AVI, MKV, or WebM)");
      return;
    }

    // Validate file size (max 5GB)
    if (!isValidVideoSize(file, 5)) {
      setError("File too large. Maximum size is 5GB");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const pollVideoStatus = useCallback(async (videoId: string) => {
    try {
      const response = await fetch(`/api/video/upload?videoId=${videoId}`);
      const data = await response.json();

      if (data.status === "ready") {
        setStatus("complete");
        setProcessingProgress(100);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
        if (onUploadComplete) {
          onUploadComplete(videoId);
        }
      } else if (data.status === "error") {
        setStatus("error");
        setError(data.errorMessage || "Video processing failed");
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
        if (onUploadError) {
          onUploadError(data.errorMessage || "Video processing failed");
        }
      } else if (data.status === "processing") {
        setProcessingProgress(parseInt(data.percentComplete || "0"));
      }
    } catch (error) {
      console.error("Error polling video status:", error);
    }
  }, [onUploadComplete, onUploadError]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");
    setUploadProgress(0);
    setError(null);

    try {
      // Step 1: Get signed upload URL
      const response = await fetch("/api/video/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutId,
          maxDurationSeconds: 7200, // 2 hours
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get upload URL");
      }

      const { uploadURL, videoId: newVideoId } = await response.json();
      setVideoId(newVideoId);

      // Step 2: Upload video to Cloudflare Stream
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setStatus("processing");
          setUploadProgress(100);
          
          // Start polling for processing status
          pollIntervalRef.current = setInterval(() => {
            pollVideoStatus(newVideoId);
          }, 3000); // Poll every 3 seconds
        } else {
          setStatus("error");
          setError("Upload failed. Please try again.");
          if (onUploadError) {
            onUploadError("Upload failed");
          }
        }
      });

      xhr.addEventListener("error", () => {
        setStatus("error");
        setError("Network error during upload");
        if (onUploadError) {
          onUploadError("Network error");
        }
      });

      xhr.open("PUT", uploadURL);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
      setError(error instanceof Error ? error.message : "Upload failed");
      if (onUploadError) {
        onUploadError(error instanceof Error ? error.message : "Upload failed");
      }
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setUploadProgress(0);
    setProcessingProgress(0);
    setError(null);
    setVideoId(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-6 h-6 animate-spin text-primary" />;
      case "complete":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Video className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading video...";
      case "processing":
        return "Processing video...";
      case "complete":
        return "Upload complete!";
      case "error":
        return "Upload failed";
      default:
        return "Ready to upload";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>
          Upload a video for: <strong>{workoutTitle}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection */}
        {status === "idle" && (
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                "hover:border-primary hover:bg-primary/5",
                selectedFile && "border-primary bg-primary/5"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Click to select video</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    MP4, MOV, AVI, MKV, or WebM (max 5GB)
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="flex gap-2">
                <Button onClick={handleUpload} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {status === "uploading" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="font-medium">{getStatusText()}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedFile?.name}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </div>
        )}

        {/* Processing Progress */}
        {status === "processing" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="font-medium">{getStatusText()}</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few minutes
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Progress</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} />
            </div>
          </div>
        )}

        {/* Complete */}
        {status === "complete" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="font-medium">{getStatusText()}</p>
                <p className="text-sm text-muted-foreground">
                  Video is ready for streaming
                </p>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Upload Another Video
            </Button>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="font-medium">{getStatusText()}</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
