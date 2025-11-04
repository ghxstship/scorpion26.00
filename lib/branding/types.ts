/**
 * Brand Theme Configuration Types
 * Defines the structure for white-label customization
 */

export interface TypographyConfig {
  // Font families
  title: string;
  subtitle: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  body: string;
  button: string;
  caption: string;
  
  // Font weights
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  
  // Font sizes (in rem)
  sizes: {
    title: string;
    subtitle: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    body: string;
    bodyLarge: string;
    bodySmall: string;
    button: string;
    caption: string;
  };
  
  // Line heights
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  
  // Letter spacing
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface ColorScheme {
  // Primary brand colors
  primary: {
    DEFAULT: string;
    foreground: string;
    light: string;
    dark: string;
  };
  
  // Secondary colors
  secondary: {
    DEFAULT: string;
    foreground: string;
    light: string;
    dark: string;
  };
  
  // Accent colors
  accent: {
    DEFAULT: string;
    foreground: string;
    light: string;
    dark: string;
  };
  
  // Background colors
  background: {
    DEFAULT: string;
    secondary: string;
    tertiary: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // UI element colors
  border: string;
  input: string;
  ring: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Dark mode variants
  dark?: ColorScheme;
}

export interface ImageryConfig {
  // Logo variants
  logo: {
    primary: string;
    secondary?: string;
    icon?: string;
    white?: string;
    black?: string;
  };
  
  // Hero images
  hero: {
    home?: string;
    about?: string;
    programs?: string;
    shop?: string;
    community?: string;
  };
  
  // Background patterns/textures
  patterns: {
    primary?: string;
    secondary?: string;
    texture?: string;
  };
  
  // Placeholder images
  placeholders: {
    avatar?: string;
    product?: string;
    thumbnail?: string;
  };
}

export interface StyleConfig {
  // Border radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
  };
  
  // Transitions
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  
  // Spacing scale
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  
  // Container widths
  containers: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
}

export interface BrandTheme {
  id: string;
  name: string;
  description?: string;
  typography: TypographyConfig;
  colors: {
    light: ColorScheme;
    dark: ColorScheme;
  };
  imagery: ImageryConfig;
  style: StyleConfig;
  customCSS?: string;
}

export interface BrandConfig {
  activeTheme: string;
  themes: Record<string, BrandTheme>;
}
