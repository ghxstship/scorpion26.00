"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Subtitles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CaptionOption {
  id: string;
  language: string;
  languageName: string;
  url: string;
  isDefault?: boolean;
}

export interface CaptionSelectorProps {
  captions: CaptionOption[];
  selectedCaption: string | null;
  onCaptionChange: (captionId: string | null) => void;
}

export function CaptionSelector({
  captions,
  selectedCaption,
  onCaptionChange,
}: CaptionSelectorProps) {
  if (captions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-white hover:bg-white/20",
            selectedCaption && "bg-white/10"
          )}
          title="Captions"
        >
          <Subtitles className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-black/90 border-white/20">
        <DropdownMenuItem
          onClick={() => onCaptionChange(null)}
          className={cn(
            "text-white hover:bg-white/20 cursor-pointer",
            !selectedCaption && "bg-white/10"
          )}
        >
          Off
        </DropdownMenuItem>
        {captions.map((caption) => (
          <DropdownMenuItem
            key={caption.id}
            onClick={() => onCaptionChange(caption.id)}
            className={cn(
              "text-white hover:bg-white/20 cursor-pointer",
              selectedCaption === caption.id && "bg-white/10"
            )}
          >
            {caption.languageName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
