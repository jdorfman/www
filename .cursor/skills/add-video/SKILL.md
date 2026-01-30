---
name: add-video
description: Add a new YouTube video to the portfolio. New video becomes Horizontal Video Card 1, all other videos shift down, oldest goes to More section. Use when user types /add-video followed by a YouTube URL.
---

# Add Video to Portfolio

When user types `/add-video <URL>`, follow these steps exactly.

## Step 1: Extract Video ID

From the URL, extract the video ID:
- `youtube.com/watch?v=VIDEO_ID` → use VIDEO_ID
- `youtu.be/VIDEO_ID` → use VIDEO_ID
- `youtube.com/embed/VIDEO_ID` → use VIDEO_ID

## Step 2: Fetch Video Title

Use the YouTube oEmbed API to get the video title (no API key needed):

```
https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={VIDEO_ID}&format=json
```

Fetch this URL and extract the `title` field from the JSON response. Use this title for:
- The iframe `title` attribute
- The `<h3 class="video-card-title">` text

If the fetch fails, fall back to "Video" as the default title.

## Step 3: Read index.html

Read `index.html` and identify these 5 video cards by their HTML comments:
- `<!-- Horizontal Video Card 1 -->` - first large video
- `<!-- Horizontal Video Card 2 -->` - second large video
- `<!-- Small Video Card 1 -->` - first small video
- `<!-- Small Video Card 2 -->` - second small video
- `<!-- Small Video Card 3 -->` - third small video

Also find `<!-- More Videos Section -->` where archived videos go.

## Step 4: Cascade Videos Down

Perform these moves in order:

1. **Small Card 3 → More section**: Copy the entire `<article>` from Small Card 3 and insert it at the START of the More section's `<div class="video-grid">`, right after the `<!-- Archived videos appear here -->` comment (push existing archived videos down).

2. **Small Card 2 → Small Card 3**: Replace Small Card 3's `<article>` content with Small Card 2's content. Keep the `<!-- Small Video Card 3 -->` comment.

3. **Small Card 1 → Small Card 2**: Replace Small Card 2's `<article>` content with Small Card 1's content. Keep the `<!-- Small Video Card 2 -->` comment.

4. **Horizontal Card 2 → Small Card 1**: Replace Small Card 1's `<article>` with Horizontal Card 2's content, but change the class from `video-card-horizontal` to `video-card-small`. Keep the `<!-- Small Video Card 1 -->` comment.

5. **Horizontal Card 1 → Horizontal Card 2**: Replace Horizontal Card 2's `<article>` content with Horizontal Card 1's content. Keep the `<!-- Horizontal Video Card 2 -->` comment.

6. **New video → Horizontal Card 1**: Update Horizontal Card 1 with the new video:
   - Set iframe src to `https://www.youtube.com/embed/{VIDEO_ID}`
   - Set iframe title to the fetched YouTube title (from Step 2)
   - Set `<h3 class="video-card-title">` to the fetched YouTube title
   - Keep category as "Deep Dives / Demos" unless specified

## Video Card Templates

**Horizontal card (for positions 1-2):**
```html
          <!-- Horizontal Video Card 1 -->
          <article class="video-card video-card-horizontal">
            <div class="video-thumbnail video-thumbnail-16-9">
              <iframe 
                src="https://www.youtube.com/embed/{VIDEO_ID}" 
                title="{TITLE}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
              </iframe>
            </div>
            <div class="video-info">
              <span class="video-category">{CATEGORY}</span>
              <h3 class="video-card-title">{TITLE}</h3>
            </div>
          </article>
```

**Small card (for positions 1-3 and More section):**
```html
          <!-- Small Video Card 1 -->
          <article class="video-card video-card-small">
            <div class="video-thumbnail video-thumbnail-16-9">
              <iframe 
                src="https://www.youtube.com/embed/{VIDEO_ID}" 
                title="{TITLE}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
              </iframe>
            </div>
            <div class="video-info">
              <span class="video-category">{CATEGORY}</span>
              <h3 class="video-card-title">{TITLE}</h3>
            </div>
          </article>
```

## Example

Input: `/add-video https://www.youtube.com/watch?v=abc123`

Before:
- Horizontal 1: Video A
- Horizontal 2: Video B
- Small 1: Video C
- Small 2: Video D
- Small 3: Video E
- More: [Video F, Video G...]

After:
- Horizontal 1: **NEW VIDEO** (abc123)
- Horizontal 2: Video A
- Small 1: Video B (changed from horizontal to small class)
- Small 2: Video C
- Small 3: Video D
- More: [Video E, Video F, Video G...]

## Optional Title/Category Override

By default, the video title is fetched automatically from YouTube.

If user wants to override the title: `/add-video URL "My Custom Title"`
If user wants to override title and category: `/add-video URL "My Custom Title" "Category Name"`

User-provided values take precedence over the fetched YouTube title. Default category is "Deep Dives / Demos".
