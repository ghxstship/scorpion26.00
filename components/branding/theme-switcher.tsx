'use client';

import React from 'react';
import { useBrand } from '@/lib/branding/brand-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Moon, Sun } from 'lucide-react';

/**
 * Theme Switcher Component
 * Allows users to switch between different brand themes
 */
export function ThemeSwitcher() {
  const { theme, allThemes, activeThemeId, setActiveTheme, isDarkMode, toggleDarkMode } = useBrand();

  return (
    <div className="flex items-center gap-2">
      {/* Dark Mode Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {/* Theme Selector */}
      {allThemes.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Select theme">
              <Palette className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allThemes.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setActiveTheme(t.id)}
                className={activeThemeId === t.id ? 'bg-accent' : ''}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t.name}</span>
                  {t.description && (
                    <span className="text-xs text-muted-foreground">{t.description}</span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

/**
 * Simple Dark Mode Toggle
 * Standalone dark mode toggle without theme selection
 */
export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useBrand();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
