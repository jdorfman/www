import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const VIDEOS_JSON = path.join(ROOT, 'data', 'videos.json');
export const INDEX_HTML = path.join(ROOT, 'index.html');
export const START_MARKER = '<!-- VIDEOS:START -->';
export const END_MARKER = '<!-- VIDEOS:END -->';
export const DEFAULT_CATEGORY = 'Deep Dives / Demos';

const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function readVideos() {
  const raw = fs.readFileSync(VIDEOS_JSON, 'utf8');
  return JSON.parse(raw);
}

export function writeVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2) + '\n');
}

export function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error(`Could not extract video ID from URL: ${url}`);
}

export async function fetchYouTubeTitle(videoId) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const response = await fetch(oembedUrl);

  if (!response.ok) {
    throw new Error(`oEmbed request failed (${response.status})`);
  }

  const data = await response.json();
  return data.title;
}

function renderCard(video, size, comment, indent) {
  const cardClass = size === 'horizontal' ? 'video-card-horizontal' : 'video-card-small';
  const pad = ' '.repeat(indent);
  const innerPad = pad + '  ';
  const titleAttr = escapeHtml(video.title);
  const commentLine = comment ? `${pad}<!-- ${comment} -->\n` : '';

  return `${commentLine}${pad}<article class="video-card ${cardClass}">
${innerPad}<div class="video-thumbnail video-thumbnail-16-9">
${innerPad}  <iframe 
${innerPad}    src="https://www.youtube.com/embed/${video.id}" 
${innerPad}    title="${titleAttr}"
${innerPad}    frameborder="0" 
${innerPad}    allow="${IFRAME_ALLOW}" 
${innerPad}    allowfullscreen
${innerPad}    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
${innerPad}  </iframe>
${innerPad}</div>
${innerPad}<div class="video-info">
${innerPad}  <span class="video-category">${escapeHtml(video.category)}</span>
${innerPad}  <h3 class="video-card-title">${escapeHtml(video.title)}</h3>
${innerPad}</div>
${pad}</article>`;
}

export function renderVideosHtml(videos) {
  const featured = videos.slice(0, 5);
  const archived = videos.slice(5);
  const lines = [];

  const featuredComments = [
    'Horizontal Video Card 1',
    'Horizontal Video Card 2',
    'Small Video Card 1',
    'Small Video Card 2',
    'Small Video Card 3',
  ];
  const featuredSizes = ['horizontal', 'horizontal', 'small', 'small', 'small'];

  for (let i = 0; i < featured.length; i++) {
    lines.push(
      renderCard(featured[i], featuredSizes[i], featuredComments[i], 10)
    );
  }

  lines.push('        </div>');
  lines.push('');
  lines.push('        <!-- More Videos Section -->');
  lines.push(
    '        <div class="more-section" id="more-videos" style="display: none;">'
  );
  lines.push('          <div class="video-grid">');
  lines.push('            <!-- Archived videos appear here -->');

  for (const video of archived) {
    lines.push(renderCard(video, 'small', null, 12));
  }

  lines.push('          </div>');
  lines.push('        </div>');

  return lines.join('\n');
}

export function renderVideosSection() {
  const videos = readVideos();
  return `${START_MARKER}\n${renderVideosHtml(videos)}\n          ${END_MARKER}`;
}

export function updateIndexHtml() {
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in index.html. Expected ${START_MARKER} and ${END_MARKER}`);
  }

  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx + END_MARKER.length);
  const section = renderVideosSection();
  fs.writeFileSync(INDEX_HTML, before + section + after);
}
