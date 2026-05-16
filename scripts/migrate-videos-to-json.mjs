#!/usr/bin/env node
/**
 * One-time migration: extract long-form videos from index.html into data/videos.json.
 * Skips shorts carousel; reads featured + archived articles in DOM order.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INDEX_HTML, VIDEOS_JSON, writeVideos } from './video-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function decodeHtmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseVideosFromHtml(html) {
  const start = html.indexOf('<!-- Horizontal Video Card 1 -->');
  const moreButton = html.indexOf('<button class="btn btn-outline more-toggle"');
  const block = html.slice(start, moreButton);

  const articleRegex =
    /<article class="video-card[^"]*">[\s\S]*?embed\/([^"?]+)[\s\S]*?title="([^"]*)"[\s\S]*?video-category">([^<]*)<\/span>[\s\S]*?video-card-title">([^<]*)<\/h3>/g;

  const videos = [];
  let match;

  while ((match = articleRegex.exec(block)) !== null) {
    videos.push({
      id: match[1],
      title: decodeHtmlEntities(match[4].trim() || match[2]),
      category: match[3].trim(),
    });
  }

  return videos;
}

function main() {
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const videos = parseVideosFromHtml(html);

  if (videos.length === 0) {
    console.error('No videos found. Check index.html structure.');
    process.exit(1);
  }

  writeVideos(videos);
  console.log(`Wrote ${videos.length} videos to ${path.relative(path.resolve(__dirname, '..'), VIDEOS_JSON)}`);
}

main();
