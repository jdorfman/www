#!/usr/bin/env node
import {
  DEFAULT_CATEGORY,
  extractVideoId,
  fetchYouTubeTitle,
  readVideos,
  updateIndexHtml,
  writeVideos,
} from './video-lib.mjs';

async function main() {
  const url = process.argv[2];
  const titleOverride = process.argv[3];
  const categoryOverride = process.argv[4];

  if (!url) {
    console.error('Usage: node scripts/add-video.mjs <youtube-url> ["Custom Title"] ["Category Name"]');
    process.exit(1);
  }

  const id = extractVideoId(url);
  const videos = readVideos();

  if (videos.some((video) => video.id === id)) {
    console.error(`Video ${id} is already in data/videos.json`);
    process.exit(1);
  }

  let title = titleOverride;
  if (!title) {
    try {
      title = await fetchYouTubeTitle(id);
    } catch {
      title = 'Video';
    }
  }

  const category = categoryOverride || DEFAULT_CATEGORY;
  const entry = { id, title, category };

  videos.unshift(entry);
  writeVideos(videos);
  updateIndexHtml();

  console.log(`Added: ${title}`);
  console.log(`ID: ${id}`);
  console.log('Position: Horizontal Video Card 1 (featured)');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
