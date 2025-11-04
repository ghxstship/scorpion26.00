import { BrandConfig, BrandTheme } from './types';
import { scorpionPreset } from './presets/scorpion-preset';

/**
 * Brand Configuration Manager
 * Manages theme presets and active theme selection
 */

// Default brand configuration
export const defaultBrandConfig: BrandConfig = {
  activeTheme: 'scorpion',
  themes: {
    scorpion: scorpionPreset,
  },
};

// In-memory brand configuration (can be replaced with database/API)
let currentBrandConfig: BrandConfig = defaultBrandConfig;

/**
 * Get the current brand configuration
 */
export function getBrandConfig(): BrandConfig {
  return currentBrandConfig;
}

/**
 * Get the active theme
 */
export function getActiveTheme(): BrandTheme {
  return currentBrandConfig.themes[currentBrandConfig.activeTheme];
}

/**
 * Get a specific theme by ID
 */
export function getTheme(themeId: string): BrandTheme | undefined {
  return currentBrandConfig.themes[themeId];
}

/**
 * Set the active theme
 */
export function setActiveTheme(themeId: string): void {
  if (!currentBrandConfig.themes[themeId]) {
    throw new Error(`Theme "${themeId}" not found`);
  }
  currentBrandConfig.activeTheme = themeId;
}

/**
 * Add or update a theme
 */
export function setTheme(theme: BrandTheme): void {
  currentBrandConfig.themes[theme.id] = theme;
}

/**
 * Remove a theme
 */
export function removeTheme(themeId: string): void {
  if (themeId === currentBrandConfig.activeTheme) {
    throw new Error('Cannot remove the active theme');
  }
  delete currentBrandConfig.themes[themeId];
}

/**
 * Get all available themes
 */
export function getAllThemes(): BrandTheme[] {
  return Object.values(currentBrandConfig.themes);
}

/**
 * Update the entire brand configuration
 */
export function updateBrandConfig(config: BrandConfig): void {
  currentBrandConfig = config;
}

/**
 * Reset to default configuration
 */
export function resetBrandConfig(): void {
  currentBrandConfig = defaultBrandConfig;
}

/**
 * Generate CSS variables from theme
 */
export function generateCSSVariables(theme: BrandTheme, mode: 'light' | 'dark' = 'light'): string {
  const colors = theme.colors[mode];
  const { typography, style } = theme;
  
  return `
    /* Typography Variables */
    --font-title: ${typography.title};
    --font-subtitle: ${typography.subtitle};
    --font-heading-1: ${typography.heading1};
    --font-heading-2: ${typography.heading2};
    --font-heading-3: ${typography.heading3};
    --font-heading-4: ${typography.heading4};
    --font-body: ${typography.body};
    --font-button: ${typography.button};
    --font-caption: ${typography.caption};
    
    /* Font Sizes */
    --text-title: ${typography.sizes.title};
    --text-subtitle: ${typography.sizes.subtitle};
    --text-h1: ${typography.sizes.h1};
    --text-h2: ${typography.sizes.h2};
    --text-h3: ${typography.sizes.h3};
    --text-h4: ${typography.sizes.h4};
    --text-h5: ${typography.sizes.h5};
    --text-h6: ${typography.sizes.h6};
    --text-body: ${typography.sizes.body};
    --text-body-large: ${typography.sizes.bodyLarge};
    --text-body-small: ${typography.sizes.bodySmall};
    --text-button: ${typography.sizes.button};
    --text-caption: ${typography.sizes.caption};
    
    /* Line Heights */
    --leading-tight: ${typography.lineHeights.tight};
    --leading-normal: ${typography.lineHeights.normal};
    --leading-relaxed: ${typography.lineHeights.relaxed};
    --leading-loose: ${typography.lineHeights.loose};
    
    /* Letter Spacing */
    --tracking-tighter: ${typography.letterSpacing.tighter};
    --tracking-tight: ${typography.letterSpacing.tight};
    --tracking-normal: ${typography.letterSpacing.normal};
    --tracking-wide: ${typography.letterSpacing.wide};
    --tracking-wider: ${typography.letterSpacing.wider};
    --tracking-widest: ${typography.letterSpacing.widest};
    
    /* Color Variables */
    --color-primary: ${colors.primary.DEFAULT};
    --color-primary-foreground: ${colors.primary.foreground};
    --color-primary-light: ${colors.primary.light};
    --color-primary-dark: ${colors.primary.dark};
    
    --color-secondary: ${colors.secondary.DEFAULT};
    --color-secondary-foreground: ${colors.secondary.foreground};
    --color-secondary-light: ${colors.secondary.light};
    --color-secondary-dark: ${colors.secondary.dark};
    
    --color-accent: ${colors.accent.DEFAULT};
    --color-accent-foreground: ${colors.accent.foreground};
    --color-accent-light: ${colors.accent.light};
    --color-accent-dark: ${colors.accent.dark};
    
    --color-background: ${colors.background.DEFAULT};
    --color-background-secondary: ${colors.background.secondary};
    --color-background-tertiary: ${colors.background.tertiary};
    
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-text-tertiary: ${colors.text.tertiary};
    --color-text-inverse: ${colors.text.inverse};
    
    --color-border: ${colors.border};
    --color-input: ${colors.input};
    --color-ring: ${colors.ring};
    
    --color-success: ${colors.success};
    --color-warning: ${colors.warning};
    --color-error: ${colors.error};
    --color-info: ${colors.info};
    
    /* Border Radius */
    --radius-none: ${style.borderRadius.none};
    --radius-sm: ${style.borderRadius.sm};
    --radius-md: ${style.borderRadius.md};
    --radius-lg: ${style.borderRadius.lg};
    --radius-xl: ${style.borderRadius.xl};
    --radius-full: ${style.borderRadius.full};
    
    /* Shadows */
    --shadow-sm: ${style.shadows.sm};
    --shadow-md: ${style.shadows.md};
    --shadow-lg: ${style.shadows.lg};
    --shadow-xl: ${style.shadows.xl};
    --shadow-inner: ${style.shadows.inner};
    
    /* Transitions */
    --transition-fast: ${style.transitions.fast};
    --transition-normal: ${style.transitions.normal};
    --transition-slow: ${style.transitions.slow};
    
    /* Spacing */
    --spacing-xs: ${style.spacing.xs};
    --spacing-sm: ${style.spacing.sm};
    --spacing-md: ${style.spacing.md};
    --spacing-lg: ${style.spacing.lg};
    --spacing-xl: ${style.spacing.xl};
    --spacing-2xl: ${style.spacing['2xl']};
    --spacing-3xl: ${style.spacing['3xl']};
  `.trim();
}

/**
 * Generate Google Fonts import URL
 */
export function generateFontImports(theme: BrandTheme): string {
  const fonts = new Set<string>();
  
  // Extract unique font families
  const extractFont = (fontFamily: string) => {
    const match = fontFamily.match(/"([^"]+)"/);
    if (match) fonts.add(match[1]);
  };
  
  extractFont(theme.typography.title);
  extractFont(theme.typography.subtitle);
  extractFont(theme.typography.heading1);
  extractFont(theme.typography.heading2);
  extractFont(theme.typography.heading3);
  extractFont(theme.typography.heading4);
  extractFont(theme.typography.body);
  extractFont(theme.typography.button);
  extractFont(theme.typography.caption);
  
  // Generate Google Fonts URL
  const fontParams = Array.from(fonts)
    .map(font => `family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900`)
    .join('&');
  
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}
