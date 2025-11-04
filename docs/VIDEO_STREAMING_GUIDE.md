# Video Streaming System - Complete Guide

## Overview

This guide covers the complete video streaming implementation for Scorpion26, including HLS adaptive bitrate streaming, offline downloads, progress tracking, and admin upload pipeline powered by Cloudflare Stream.

## Table of Contents

1. [Architecture](#architecture)
2. [Setup & Configuration](#setup--configuration)
3. [Admin Video Upload](#admin-video-upload)
4. [Video Player Usage](#video-player-usage)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### Technology Stack

- **CDN**: Cloudflare Stream (HLS adaptive bitrate)
- **Player**: HLS.js (with native HLS fallback for Safari)
- **Database**: Supabase PostgreSQL
- **Storage**: IndexedDB (for offline downloads)
- **Service Worker**: For video caching

### Key Features

✅ **Adaptive Bitrate Streaming** - Automatic quality adjustment (360p-1080p)  
✅ **Progress Tracking** - Resume from last position  
✅ **Offline Downloads** - Watch without internet  
✅ **Closed Captions** - Multi-language subtitle support  
✅ **Picture-in-Picture** - Continue watching while browsing  
✅ **Keyboard Shortcuts** - Full keyboard navigation  
✅ **Mobile Optimized** - Touch controls and responsive design  

---

## Setup & Configuration

### 1. Install Dependencies

```bash
npm install
```

Required packages (already added to `package.json`):
- `hls.js` - HLS video player
- `@radix-ui/react-progress` - Progress bars
- `@radix-ui/react-slider` - Volume/progress sliders

### 2. Configure Cloudflare Stream

1. **Create Cloudflare Account**
   - Go to https://dash.cloudflare.com
   - Sign up or log in

2. **Enable Stream**
   - Navigate to Stream in the dashboard
   - Note your Account ID

3. **Generate API Token**
   - Go to Stream > API Tokens
   - Create token with "Stream:Edit" permissions
   - Copy the token

4. **Update Environment Variables**

Create `.env.local` file:

```bash
# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_STREAM_API_TOKEN=your_api_token_here
```

### 3. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply migration manually
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/20251104040000_video_streaming_system.sql
```

This creates:
- `video_progress` table
- `video_captions` table
- `video_downloads` table
- Enhanced `workouts` table with video metadata

### 4. Verify Setup

```bash
npm run dev
```

Visit http://localhost:3000/admin/workouts to test video upload.

---

## Admin Video Upload

### Upload Process

1. **Navigate to Admin Workouts**
   ```
   /admin/workouts
   ```

2. **Select Workout**
   - Click on a workout to edit
   - Find the "Upload Video" section

3. **Upload Video**
   - Click "Select Video" or drag & drop
   - Supported formats: MP4, MOV, AVI, MKV, WebM
   - Max size: 5GB
   - Click "Upload Video"

4. **Monitor Progress**
   - Upload progress (0-100%)
   - Processing progress (Cloudflare encoding)
   - Estimated time: 2-5 minutes per GB

5. **Video Ready**
   - Status changes to "Ready"
   - Thumbnail auto-generated
   - HLS manifest created

### Using the VideoUpload Component

```tsx
import { VideoUpload } from "@/components/admin/video-upload";

<VideoUpload
  workoutId="uuid-here"
  workoutTitle="Upper Body Strength"
  onUploadComplete={(videoId) => {
    console.log("Video ready:", videoId);
  }}
  onUploadError={(error) => {
    console.error("Upload failed:", error);
  }}
/>
```

### Bulk Upload (Future Enhancement)

For bulk uploads, use the Cloudflare Stream API directly:

```typescript
import { uploadVideo } from "@/lib/video/cloudflare-stream";

const videos = [/* array of files */];

for (const file of videos) {
  const result = await uploadVideo(file, {
    name: file.name,
    requireSignedURLs: true,
  });
  
  // Save to database
  await saveVideoMetadata(result.uid);
}
```

---

## Video Player Usage

### Basic Implementation

```tsx
import { VideoPlayer } from "@/components/workout/video-player";

<VideoPlayer
  workoutId="workout-uuid"
  videoUrl="https://customer-xxx.cloudflarestream.com/video-id/manifest/video.m3u8"
  thumbnailUrl="https://customer-xxx.cloudflarestream.com/video-id/thumbnails/thumbnail.jpg"
  captions={[
    {
      id: "en",
      language: "en",
      languageName: "English",
      url: "/captions/workout-en.vtt",
      isDefault: true,
    },
  ]}
  initialProgress={120} // Resume from 2 minutes
  onProgressUpdate={(progress, duration) => {
    // Save progress every 5 seconds
    saveProgress(progress, duration);
  }}
  onComplete={() => {
    // Video completed (95%+ watched)
    markWorkoutComplete();
  }}
  autoPlay={false}
  allowDownload={true}
/>
```

### Player Controls

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `K` | Play/Pause |
| `←` | Skip backward 10s |
| `→` | Skip forward 10s |
| `↑` | Volume up |
| `↓` | Volume down |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
| `0-9` | Jump to 0%-90% |

#### Touch Controls

- **Tap** - Play/Pause
- **Double tap left** - Skip backward
- **Double tap right** - Skip forward
- **Swipe up/down** - Volume control

### Quality Selection

Available qualities (auto-detected):
- Auto (adaptive)
- 1080p (Full HD)
- 720p (HD)
- 540p
- 360p

### Playback Speeds

- 0.25x
- 0.5x
- 0.75x
- 1x (Normal)
- 1.25x
- 1.5x
- 1.75x
- 2x

---

## API Endpoints

### Video Progress

#### Save Progress
```http
POST /api/workouts/[id]/progress
Content-Type: application/json

{
  "progress_seconds": 120,
  "duration_seconds": 600
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "id": "uuid",
    "progress_seconds": 120,
    "duration_seconds": 600,
    "completed": false,
    "last_watched_at": "2024-11-04T12:00:00Z"
  }
}
```

#### Get Progress
```http
GET /api/workouts/[id]/progress
```

**Response:**
```json
{
  "progress": {
    "progress_seconds": 120,
    "duration_seconds": 600,
    "completed": false
  }
}
```

### Video Streaming

#### Get Stream URL
```http
GET /api/workouts/[id]/stream
```

**Response:**
```json
{
  "videoUrl": "https://customer-xxx.cloudflarestream.com/video-id/manifest/video.m3u8",
  "thumbnailUrl": "https://...",
  "duration": 600,
  "resolution": "1080p",
  "captions": [
    {
      "id": "uuid",
      "language_code": "en",
      "language_name": "English",
      "caption_url": "/captions/en.vtt",
      "is_default": true
    }
  ]
}
```

### Video Upload

#### Get Upload URL
```http
POST /api/video/upload
Content-Type: application/json

{
  "workoutId": "uuid",
  "maxDurationSeconds": 7200
}
```

**Response:**
```json
{
  "uploadURL": "https://upload.cloudflarestream.com/...",
  "videoId": "cloudflare-video-id",
  "workoutId": "uuid"
}
```

#### Check Upload Status
```http
GET /api/video/upload?videoId=cloudflare-video-id
```

**Response:**
```json
{
  "videoId": "cloudflare-video-id",
  "status": "ready",
  "readyToStream": true,
  "duration": 600,
  "thumbnail": "https://...",
  "resolution": "1920x1080",
  "size": 524288000,
  "percentComplete": "100"
}
```

### Downloads

#### Register Download
```http
POST /api/workouts/download
Content-Type: application/json

{
  "workoutId": "uuid",
  "quality": "720p"
}
```

#### List Downloads
```http
GET /api/workouts/download
```

#### Delete Download
```http
DELETE /api/workouts/download?workoutId=uuid&quality=720p
```

---

## Database Schema

### video_progress

Tracks user video playback progress.

```sql
CREATE TABLE video_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  workout_id UUID REFERENCES workouts(id),
  progress_seconds INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workout_id)
);
```

### video_captions

Stores closed caption files.

```sql
CREATE TABLE video_captions (
  id UUID PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id),
  language_code VARCHAR(10) NOT NULL,
  language_name VARCHAR(50) NOT NULL,
  caption_url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_id, language_code)
);
```

### video_downloads

Tracks downloaded videos for offline viewing.

```sql
CREATE TABLE video_downloads (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  workout_id UUID REFERENCES workouts(id),
  download_quality VARCHAR(20) NOT NULL,
  file_size_bytes BIGINT,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, workout_id, download_quality)
);
```

### workouts (enhanced)

Added video metadata columns.

```sql
ALTER TABLE workouts ADD COLUMN
  cloudflare_video_id VARCHAR(255),
  video_duration_seconds INTEGER,
  video_thumbnail_url TEXT,
  video_status VARCHAR(50) DEFAULT 'pending',
  video_processing_error TEXT,
  video_resolution VARCHAR(20),
  video_file_size_bytes BIGINT;
```

---

## Testing

### Manual Testing Checklist

#### Upload
- [ ] Upload 5-minute test video
- [ ] Verify upload progress displays
- [ ] Confirm processing completes
- [ ] Check thumbnail generation
- [ ] Verify video status updates

#### Playback
- [ ] Video loads and plays
- [ ] Quality selector works
- [ ] Playback speed changes
- [ ] Progress bar seeks correctly
- [ ] Volume control works
- [ ] Fullscreen mode works
- [ ] Picture-in-Picture works

#### Progress Tracking
- [ ] Progress saves every 5 seconds
- [ ] Resume from last position works
- [ ] Completion marks at 95%
- [ ] Progress syncs across devices

#### Captions
- [ ] Captions display correctly
- [ ] Language switching works
- [ ] Caption styling is readable
- [ ] Toggle on/off works

#### Downloads
- [ ] Download button appears
- [ ] Quality selection works
- [ ] Download progress shows
- [ ] Downloaded videos list
- [ ] Offline playback works

#### Mobile
- [ ] Touch controls work
- [ ] Responsive design
- [ ] iOS Safari playback
- [ ] Android Chrome playback

#### Browser Compatibility
- [ ] Chrome (HLS.js)
- [ ] Safari (native HLS)
- [ ] Firefox (HLS.js)
- [ ] Edge (HLS.js)
- [ ] iOS Safari
- [ ] Android Chrome

### Automated Testing

```typescript
// Example test
describe("VideoPlayer", () => {
  it("should play video", async () => {
    render(<VideoPlayer videoUrl="..." />);
    const playButton = screen.getByRole("button", { name: /play/i });
    await userEvent.click(playButton);
    expect(video).toHaveAttribute("paused", "false");
  });

  it("should save progress", async () => {
    const onProgressUpdate = jest.fn();
    render(<VideoPlayer onProgressUpdate={onProgressUpdate} />);
    // Simulate 5 seconds of playback
    await waitFor(() => {
      expect(onProgressUpdate).toHaveBeenCalled();
    }, { timeout: 6000 });
  });
});
```

### Load Testing

Test concurrent viewers:

```bash
# Using Apache Bench
ab -n 1000 -c 100 https://your-domain.com/api/workouts/uuid/stream

# Expected: 95%+ success rate, <3s response time
```

---

## Troubleshooting

### Video Won't Play

**Symptoms**: Black screen, loading spinner forever

**Solutions**:
1. Check Cloudflare Stream status
2. Verify `video_status` is "ready" in database
3. Check browser console for HLS errors
4. Test HLS URL directly in browser
5. Verify CORS headers on Cloudflare

### Upload Fails

**Symptoms**: Upload stuck at 0%, error message

**Solutions**:
1. Check file size (<5GB)
2. Verify file format (MP4, MOV, etc.)
3. Check Cloudflare API token permissions
4. Verify `CLOUDFLARE_ACCOUNT_ID` is correct
5. Check network connectivity

### Progress Not Saving

**Symptoms**: Always starts from beginning

**Solutions**:
1. Check `onProgressUpdate` callback
2. Verify API endpoint `/api/workouts/[id]/progress`
3. Check database RLS policies
4. Verify user authentication
5. Check browser console for errors

### Quality Switching Not Working

**Symptoms**: Stuck on one quality

**Solutions**:
1. Verify HLS.js is loaded
2. Check available quality levels
3. Test on different network speeds
4. Verify Cloudflare encoding completed
5. Check browser compatibility

### Captions Not Displaying

**Symptoms**: No subtitles visible

**Solutions**:
1. Verify WebVTT format
2. Check caption URL is accessible
3. Verify CORS headers
4. Check `<track>` element in video
5. Test caption file directly

---

## Performance Optimization

### CDN Configuration

Cloudflare Stream automatically provides:
- Global CDN delivery
- Adaptive bitrate streaming
- Automatic thumbnail generation
- Video analytics

### Client-Side Optimization

```typescript
// Preload video metadata
<link rel="preload" as="fetch" href="/api/workouts/uuid/stream" />

// Lazy load player
const VideoPlayer = dynamic(() => import("@/components/workout/video-player"), {
  ssr: false,
  loading: () => <VideoPlayerSkeleton />
});
```

### Database Optimization

Indexes already created:
- `idx_video_progress_user_id`
- `idx_video_progress_workout_id`
- `idx_workouts_cloudflare_video_id`

---

## Cost Estimation

### Cloudflare Stream Pricing

- **Storage**: $5/1,000 minutes stored
- **Delivery**: $1/1,000 minutes delivered

### Example Calculation

For 100 workouts (30 min each):
- Storage: 3,000 minutes = $15/month
- 1,000 views/month: 30,000 minutes = $30/month
- **Total**: ~$45/month

Compare to alternatives:
- Mux: $0.005/minute viewed (~$150/month)
- AWS MediaConvert + CloudFront: ~$100/month

---

## Next Steps

### Recommended Enhancements

1. **Analytics Dashboard**
   - View counts per video
   - Average watch time
   - Drop-off points
   - Popular quality settings

2. **Advanced Features**
   - Live streaming support
   - Interactive chapters/markers
   - A/B testing different thumbnails
   - Personalized recommendations

3. **Mobile Apps**
   - React Native video player
   - Background audio playback
   - Download management

4. **Content Protection**
   - DRM integration
   - Signed URLs with expiration
   - Geo-blocking
   - Watermarking

---

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review Cloudflare Stream docs: https://developers.cloudflare.com/stream/
- Contact support: support@scorpion26.com

---

**Last Updated**: November 4, 2024  
**Version**: 1.0.0
