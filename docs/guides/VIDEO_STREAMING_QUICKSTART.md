# Video Streaming - Quick Start Guide

Get your video streaming system up and running in 15 minutes.

## Prerequisites

- Node.js 18+ installed
- Supabase project configured
- Cloudflare account (free tier available)

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

This installs:
- `hls.js` - Video player
- `@radix-ui/react-progress` - Progress UI
- `@radix-ui/react-slider` - Volume controls

## Step 2: Configure Cloudflare Stream (5 minutes)

### 2.1 Create Cloudflare Account
1. Go to https://dash.cloudflare.com
2. Sign up (free tier includes 1,000 minutes storage)

### 2.2 Get Credentials
1. Navigate to **Stream** in dashboard
2. Copy your **Account ID** (top right)
3. Go to **API Tokens** > **Create Token**
4. Select **Stream:Edit** permissions
5. Copy the generated token

### 2.3 Add to Environment
Create `.env.local`:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_STREAM_API_TOKEN=your_token_here
```

## Step 3: Run Database Migration (3 minutes)

```bash
# Option A: Using Supabase CLI (recommended)
supabase db push

# Option B: Manual SQL
# Copy contents of: supabase/migrations/20251104040000_video_streaming_system.sql
# Run in Supabase SQL Editor
```

This creates 3 new tables:
- `video_progress` - Track playback position
- `video_captions` - Store subtitles
- `video_downloads` - Manage offline videos

## Step 4: Test Upload (5 minutes)

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Upload Test Video
1. Navigate to http://localhost:3000/admin/workouts
2. Select any workout
3. Click "Upload Video"
4. Choose a short test video (< 100MB recommended)
5. Wait for upload + processing (~2-3 minutes)

### 4.3 Verify Video
1. Go to http://localhost:3000/member/workouts
2. Click on the workout with uploaded video
3. Video should play with controls

## Step 5: Verify Features

Test these key features:

✅ **Play/Pause** - Click video or press Space  
✅ **Quality Selection** - Click Settings icon  
✅ **Playback Speed** - Click speed button (1x)  
✅ **Fullscreen** - Click fullscreen icon or press F  
✅ **Progress Saving** - Play for 10s, refresh page, should resume  
✅ **Keyboard Shortcuts** - Arrow keys to skip, M to mute  

## Common Issues

### "Video not found"
- Check `video_status` in database is "ready"
- Verify Cloudflare video ID exists
- Wait 2-3 minutes for processing

### "Unauthorized" error
- Verify environment variables are set
- Check Cloudflare API token has correct permissions
- Restart dev server after adding env vars

### Video won't play
- Check browser console for errors
- Try different browser (Safari uses native HLS)
- Verify video uploaded successfully to Cloudflare

## Next Steps

### Add Video to Existing Workout

```typescript
// In your workout page
import { VideoPlayer } from "@/components/workout/video-player";

<VideoPlayer
  workoutId={workout.id}
  videoUrl={workout.video_url}
  thumbnailUrl={workout.video_thumbnail_url}
  onProgressUpdate={async (progress, duration) => {
    await fetch(`/api/workouts/${workout.id}/progress`, {
      method: "POST",
      body: JSON.stringify({ progress_seconds: progress, duration_seconds: duration })
    });
  }}
/>
```

### Enable Downloads

```typescript
<VideoPlayer
  // ... other props
  allowDownload={true}
/>
```

### Add Captions

1. Create WebVTT file:
```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to this workout!

00:00:05.000 --> 00:00:10.000
Let's get started with a warm-up.
```

2. Upload to Supabase Storage or CDN

3. Add to database:
```sql
INSERT INTO video_captions (workout_id, language_code, language_name, caption_url, is_default)
VALUES ('workout-uuid', 'en', 'English', '/captions/workout-en.vtt', true);
```

4. Captions will appear automatically in player

## Production Checklist

Before deploying to production:

- [ ] Set production Cloudflare credentials
- [ ] Configure CDN caching headers
- [ ] Set up video analytics tracking
- [ ] Test on mobile devices (iOS/Android)
- [ ] Verify RLS policies in Supabase
- [ ] Set up monitoring/alerts for upload failures
- [ ] Configure backup/disaster recovery
- [ ] Test with slow network (3G simulation)
- [ ] Verify CORS configuration
- [ ] Set up cost alerts in Cloudflare

## Cost Monitoring

### Free Tier Limits
- Cloudflare Stream: 1,000 minutes storage free
- After: $5/1,000 minutes stored + $1/1,000 minutes delivered

### Monitor Usage
```bash
# Check Cloudflare dashboard
https://dash.cloudflare.com/stream/analytics
```

### Optimize Costs
1. Delete unused videos
2. Use lower quality for previews
3. Implement view limits per user
4. Cache API responses

## Getting Help

- **Full Documentation**: `/docs/VIDEO_STREAMING_GUIDE.md`
- **Cloudflare Docs**: https://developers.cloudflare.com/stream/
- **HLS.js Docs**: https://github.com/video-dev/hls.js/

## Summary

You now have:
- ✅ HLS adaptive bitrate streaming
- ✅ Progress tracking & resume
- ✅ Admin upload pipeline
- ✅ Quality selection (360p-1080p)
- ✅ Keyboard shortcuts
- ✅ Mobile-optimized player
- ✅ Offline download support
- ✅ Closed captions ready

**Total Setup Time**: ~15 minutes  
**Monthly Cost**: $0-45 (depending on usage)  
**Supported Formats**: MP4, MOV, AVI, MKV, WebM  
**Max File Size**: 5GB  
**Max Duration**: Unlimited  

---

**Ready to go!** 🚀

Upload your first workout video and start streaming!
