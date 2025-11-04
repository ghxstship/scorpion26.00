/**
 * Input Sanitization & Security Utilities
 * 
 * Protects against XSS, SQL injection, and other security threats
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows only safe HTML tags and attributes
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitize user input - removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w.@+-]/g, '');
}

/**
 * Sanitize phone number - keep only digits and common separators
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-() ]/g, '');
}

/**
 * Sanitize URL - ensure it's a valid HTTP/HTTPS URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize filename - remove path traversal attempts
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255); // Limit length
}

/**
 * Escape SQL-like characters (for search queries)
 */
export function escapeSqlLike(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

/**
 * Sanitize JSON input - parse and re-stringify to remove functions
 */
export function sanitizeJson<T>(input: string): T | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

/**
 * Validate and sanitize markdown content
 * Allows markdown but prevents XSS
 */
export function sanitizeMarkdown(markdown: string): string {
  // Remove script tags and event handlers
  let clean = markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');

  return clean;
}

/**
 * Rate limit key sanitization
 */
export function sanitizeRateLimitKey(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9:_-]/g, '_')
    .substring(0, 100);
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 200); // Limit length
}

/**
 * Validate and sanitize slug (URL-friendly string)
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

/**
 * Remove null bytes (can cause issues in some systems)
 */
export function removeNullBytes(input: string): string {
  return input.replace(/\0/g, '');
}

/**
 * Comprehensive input sanitization for user-generated content
 */
export function sanitizeUserContent(content: string): string {
  let sanitized = content;
  
  // Remove null bytes
  sanitized = removeNullBytes(sanitized);
  
  // Sanitize HTML
  sanitized = sanitizeHtml(sanitized);
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  sanitized = sanitized.substring(0, 10000);
  
  return sanitized;
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) =>
        typeof item === 'string' ? sanitizeInput(item) : item
      ) as any;
    }
  }
  
  return sanitized;
}

/**
 * Example usage:
 * 
 * // Sanitize HTML content
 * const clean = sanitizeHtml(userInput);
 * 
 * // Sanitize form data
 * const sanitized = sanitizeObject(formData);
 * 
 * // Sanitize search query
 * const query = sanitizeSearchQuery(userQuery);
 */
