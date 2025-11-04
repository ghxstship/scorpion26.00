'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandTheme, BrandConfig } from './types';
import { 
  getBrandConfig, 
  getActiveTheme, 
  setActiveTheme as setActiveThemeConfig,
  getAllThemes,
  generateCSSVariables,
  generateFontImports
} from './brand-config';

interface BrandContextType {
  theme: BrandTheme;
  allThemes: BrandTheme[];
  activeThemeId: string;
  setActiveTheme: (themeId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: ReactNode;
  initialThemeId?: string;
}

export function BrandProvider({ children, initialThemeId }: BrandProviderProps) {
  const [activeThemeId, setActiveThemeIdState] = useState<string>(
    initialThemeId || getBrandConfig().activeTheme
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<BrandTheme>(getActiveTheme());
  const [allThemes, setAllThemes] = useState<BrandTheme[]>(getAllThemes());

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Update CSS variables when theme or dark mode changes
  useEffect(() => {
    const mode = isDarkMode ? 'dark' : 'light';
    const cssVars = generateCSSVariables(theme, mode);
    
    // Apply CSS variables to root
    const root = document.documentElement;
    const style = document.createElement('style');
    style.id = 'brand-variables';
    style.textContent = `:root { ${cssVars} }`;
    
    // Remove old style if exists
    const oldStyle = document.getElementById('brand-variables');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    document.head.appendChild(style);
    
    // Apply custom CSS if provided
    if (theme.customCSS) {
      const customStyle = document.createElement('style');
      customStyle.id = 'brand-custom-css';
      customStyle.textContent = theme.customCSS;
      
      const oldCustomStyle = document.getElementById('brand-custom-css');
      if (oldCustomStyle) {
        oldCustomStyle.remove();
      }
      
      document.head.appendChild(customStyle);
    }
    
    // Update dark mode class
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isDarkMode]);

  // Load Google Fonts
  useEffect(() => {
    const fontUrl = generateFontImports(theme);
    const linkId = 'brand-fonts';
    
    // Remove old font link if exists
    const oldLink = document.getElementById(linkId);
    if (oldLink) {
      oldLink.remove();
    }
    
    // Add new font link
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
  }, [theme]);

  const setActiveTheme = (themeId: string) => {
    setActiveThemeConfig(themeId);
    setActiveThemeIdState(themeId);
    setTheme(getActiveTheme());
    setAllThemes(getAllThemes());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  };

  return (
    <BrandContext.Provider
      value={{
        theme,
        allThemes,
        activeThemeId,
        setActiveTheme,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}

// Utility hook for accessing typography
export function useTypography() {
  const { theme } = useBrand();
  return theme.typography;
}

// Utility hook for accessing colors
export function useColors() {
  const { theme, isDarkMode } = useBrand();
  return isDarkMode ? theme.colors.dark : theme.colors.light;
}

// Utility hook for accessing imagery
export function useImagery() {
  const { theme } = useBrand();
  return theme.imagery;
}

// Utility hook for accessing style config
export function useStyle() {
  const { theme } = useBrand();
  return theme.style;
}
