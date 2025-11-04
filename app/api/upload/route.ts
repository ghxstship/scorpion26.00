import { NextRequest } from 'next/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { uploadFile, uploadMultipleFiles } from '@/lib/storage/upload';

// POST /api/upload - Upload file(s)
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string || 'general';

    if (files.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'No files provided', 400);
    }

    // Configure options based on upload type
    const options = getUploadOptions(type);

    let results;
    if (files.length === 1) {
      results = [await uploadFile(files[0], user.id, options)];
    } else {
      results = await uploadMultipleFiles(files, user.id, options);
    }

    // Check for errors
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      return errorResponse(
        'UPLOAD_ERROR',
        errors.map(e => e.error).join(', '),
        400
      );
    }

    return successResponse({
      files: results.map(r => ({
        url: r.url,
        path: r.path,
      })),
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return errorResponse('INTERNAL_ERROR', 'Upload failed', 500);
  }
});

function getUploadOptions(type: string) {
  switch (type) {
    case 'avatar':
      return {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        bucket: 'avatars',
      };
    case 'progress-photo':
      return {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        bucket: 'progress-photos',
      };
    case 'video':
      return {
        maxSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
        bucket: 'workout-videos',
      };
    case 'document':
      return {
        maxSize: 20 * 1024 * 1024, // 20MB
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        bucket: 'documents',
      };
    default:
      return {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        bucket: 'uploads',
      };
  }
}
