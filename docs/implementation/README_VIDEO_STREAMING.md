# 🎥 Video Streaming System

Production-ready video streaming for Scorpion26 workout platform.

## Quick Links

- **[15-Minute Setup Guide](./docs/VIDEO_STREAMING_QUICKSTART.md)** - Get started fast
- **[Complete Documentation](./docs/VIDEO_STREAMING_GUIDE.md)** - Full technical guide
- **[Implementation Summary](./docs/VIDEO_STREAMING_IMPLEMENTATION_SUMMARY.md)** - What was built

## Features

✅ **HLS Adaptive Streaming** - Automatic quality (360p-1080p)  
✅ **Progress Tracking** - Resume from last position  
✅ **Offline Downloads** - Watch without internet  
✅ **Closed Captions** - Multi-language subtitles  
✅ **Admin Upload** - Drag & drop interface  
✅ **Mobile Optimized** - Touch controls  
✅ **Keyboard Shortcuts** - Full navigation  
✅ **Picture-in-Picture** - Multitask while watching  

## Quick Start

### 1. Install
```bash
npm install
```

### 2. Configure
Add to `.env.local`:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_STREAM_API_TOKEN=your_token
```

### 3. Migrate
```bash
supabase db push
```

### 4. Test
```bash
npm run dev
# Visit http://localhost:3000/admin/workouts
```

## Usage

### Upload Video (Admin)
```tsx
import { VideoUpload } from "@/components/admin/video-upload";

<VideoUpload
  workoutId="uuid"
  workoutTitle="Upper Body Strength"
  onUploadComplete={(videoId) => console.log("Ready:", videoId)}
/>
```

### Play Video (Member)
```tsx
import { VideoPlayer } from "@/components/workout/video-player";

<VideoPlayer
  workoutId="uuid"
  videoUrl="https://stream.cloudflare.com/xxx/manifest/video.m3u8"
  thumbnailUrl="https://stream.cloudflare.com/xxx/thumbnails/thumbnail.jpg"
  onProgressUpdate={(progress, duration) => saveProgress(progress, duration)}
  onComplete={() => markComplete()}
/>
```

## Architecture

```
User → VideoPlayer → HLS.js → Cloudflare Stream → CDN → User
                ↓
         Progress API → Supabase → Database
```

## Cost

**Cloudflare Stream Pricing**:
- Storage: $5/1,000 minutes
- Delivery: $1/1,000 minutes

**Example** (100 workouts, 1,000 views/month):
- Storage: 3,000 min = $15
- Delivery: 30,000 min = $30
- **Total: $45/month**

Free tier: 1,000 minutes included

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ | HLS.js |
| Safari | ✅ | Native HLS |
| Firefox | ✅ | HLS.js |
| Edge | ✅ | HLS.js |
| iOS Safari | ✅ | Native HLS |
| Android Chrome | ✅ | HLS.js |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `K` | Play/Pause |
| `←` | Skip back 10s |
| `→` | Skip forward 10s |
| `↑` / `↓` | Volume |
| `F` | Fullscreen |
| `M` | Mute |
| `0-9` | Jump to % |

## API Endpoints

```
POST   /api/workouts/[id]/progress    # Save progress
GET    /api/workouts/[id]/progress    # Get progress
GET    /api/workouts/[id]/stream      # Get video URL
POST   /api/video/upload               # Upload video
GET    /api/video/upload?videoId=xxx  # Check status
POST   /api/workouts/download          # Register download
GET    /api/workouts/download          # List downloads
```

## Database Tables

- `video_progress` - Playback tracking
- `video_captions` - Subtitle files
- `video_downloads` - Offline videos
- `workouts` - Enhanced with video metadata

## File Structure

```
components/
  admin/
    video-upload.tsx          # Upload interface
  workout/
    video-player.tsx          # Main player
    video-controls.tsx        # Control bar
    video-progress-bar.tsx    # Seekbar
    caption-selector.tsx      # Subtitles
    download-button.tsx       # Downloads

lib/
  video/
    cloudflare-stream.ts      # API wrapper
    video-utils.ts            # Helpers

app/api/
  video/upload/route.ts       # Upload API
  workouts/
    [id]/progress/route.ts    # Progress API
    [id]/stream/route.ts      # Streaming API
    download/route.ts         # Download API
```

## Testing

```bash
# Manual test
npm run dev
# Upload video at /admin/workouts
# Play video at /member/workouts

# Load test
ab -n 1000 -c 100 http://localhost:3000/api/workouts/uuid/stream
```

## Troubleshooting

**Video won't play**
- Check `video_status` is "ready" in database
- Verify Cloudflare credentials
- Check browser console for errors

**Upload fails**
- File size < 5GB
- Valid format (MP4, MOV, AVI, MKV, WebM)
- Check API token permissions

**Progress not saving**
- Verify user authentication
- Check RLS policies
- Review API endpoint logs

See [Full Troubleshooting Guide](./docs/VIDEO_STREAMING_GUIDE.md#troubleshooting)

## Production Checklist

- [ ] Install dependencies
- [ ] Configure Cloudflare
- [ ] Run migration
- [ ] Test upload
- [ ] Test playback
- [ ] Verify mobile
- [ ] Set up monitoring
- [ ] Configure alerts
- [ ] Test load handling
- [ ] Review security

## Support

- **Quick Start**: [15-Minute Guide](./docs/VIDEO_STREAMING_QUICKSTART.md)
- **Full Docs**: [Complete Guide](./docs/VIDEO_STREAMING_GUIDE.md)
- **Implementation**: [Summary](./docs/VIDEO_STREAMING_IMPLEMENTATION_SUMMARY.md)
- **Cloudflare**: https://developers.cloudflare.com/stream/
- **HLS.js**: https://github.com/video-dev/hls.js/

## License

Part of Scorpion26 platform - All rights reserved

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: November 4, 2024

**Ready to stream!** 🚀
