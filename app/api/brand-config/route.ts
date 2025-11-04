import { NextResponse } from 'next/server';
import { getBrandConfig, setActiveTheme, getActiveTheme } from '@/lib/branding/brand-config';
import type { BrandConfig } from '@/lib/branding/types';

/**
 * GET /api/brand-config
 * Returns the current brand configuration
 */
export async function GET() {
  try {
    const config = getBrandConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch brand configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/brand-config
 * Updates the active theme
 * Body: { themeId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { themeId } = body;

    if (!themeId) {
      return NextResponse.json(
        { error: 'themeId is required' },
        { status: 400 }
      );
    }

    setActiveTheme(themeId);
    const activeTheme = getActiveTheme();

    return NextResponse.json({
      success: true,
      activeTheme: activeTheme.id,
      theme: activeTheme,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

/**
 * Example usage:
 * 
 * // Get current config
 * const response = await fetch('/api/brand-config');
 * const config = await response.json();
 * 
 * // Change active theme
 * const response = await fetch('/api/brand-config', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ themeId: 'scorpion' })
 * });
 */
