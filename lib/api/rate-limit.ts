import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'next-rate-limit';

// Create rate limiter instances
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

/**
 * Rate limit configurations by endpoint type
 */
export const RATE_LIMITS = {
  auth: {
    max: 5, // 5 requests per minute
    interval: 60 * 1000,
  },
  api: {
    max: 100, // 100 requests per minute
    interval: 60 * 1000,
  },
  strict: {
    max: 10, // 10 requests per minute
    interval: 60 * 1000,
  },
};

/**
 * Apply rate limiting to a route
 */
export async function applyRateLimit(
  request: NextRequest,
  config: { max: number; interval: number } = RATE_LIMITS.api
): Promise<{ success: boolean; error?: NextResponse }> {
  try {
    const headers = limiter.checkNext(request, config.max);
    
    const remaining = headers.get('X-RateLimit-Remaining');
    
    if (remaining && parseInt(remaining) < 0) {
      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests. Please try again later.',
            },
          },
          {
            status: 429,
            headers,
          }
        ),
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Rate limit error:', error);
    return { success: true }; // Don't block on rate limit errors
  }
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit(
  config: { max: number; interval: number } = RATE_LIMITS.api
) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      const result = await applyRateLimit(request, config);

      if (!result.success && result.error) {
        return result.error;
      }

      return handler(request);
    };
  };
}
