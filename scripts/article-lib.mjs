import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const ARTICLES_JSON = path.join(ROOT, 'data', 'articles.json');
export const ARTICLES_DIR = path.join(ROOT, 'assets', 'articles');
export const INDEX_HTML = path.join(ROOT, 'index.html');
export const START_MARKER = '<!-- ARTICLES:START -->';
export const END_MARKER = '<!-- ARTICLES:END -->';
export const MORE_START_MARKER = '<!-- MORE_ARTICLES:START -->';
export const MORE_END_MARKER = '<!-- MORE_ARTICLES:END -->';

const USER_AGENT =
  'Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://www.justindorfman.com)';

export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function readArticles() {
  if (!fs.existsSync(ARTICLES_JSON)) {
    return [];
  }
  const raw = fs.readFileSync(ARTICLES_JSON, 'utf8');
  return JSON.parse(raw);
}

export function writeArticles(articles) {
  fs.writeFileSync(ARTICLES_JSON, JSON.stringify(articles, null, 2) + '\n');
}

export function extractSlug(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    throw new Error(`Could not extract slug from URL: ${url}`);
  }

  const slug = segments[segments.length - 1]
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    throw new Error(`Could not extract slug from URL: ${url}`);
  }

  return slug;
}

function normalizeUrl(url) {
  const parsed = new URL(url);
  parsed.hash = '';
  return parsed.toString().replace(/\/$/, '');
}

export function findArticleIndex(articles, url) {
  const normalized = normalizeUrl(url);
  return articles.findIndex((article) => normalizeUrl(article.url) === normalized);
}

function parseMetaContent(html, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escapedProperty}["'][^>]+content="([^"]*)"`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content="([^"]*)"[^>]+property=["']${escapedProperty}["']`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+property=["']${escapedProperty}["'][^>]+content='([^']*)'`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content='([^']*)'[^>]+property=["']${escapedProperty}["']`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+name=["']${escapedProperty}["'][^>]+content="([^"]*)"`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content="([^"]*)"[^>]+name=["']${escapedProperty}["']`,
      'i'
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) return match[1].trim();
  }

  return null;
}

function parseTitleTag(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function hostnameToCategory(hostname) {
  const base = hostname.replace(/^www\./, '');
  const name = base.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function parsePublishedAt(raw) {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function formatPublishedDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function extensionFromContentType(contentType) {
  if (!contentType) return '.jpg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  return '.jpg';
}

function extensionFromUrl(imageUrl) {
  try {
    const pathname = new URL(imageUrl).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
      return ext === '.jpeg' ? '.jpg' : ext;
    }
  } catch {
    // fall through
  }
  return null;
}

export async function fetchArticleMetadata(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article URL (${response.status})`);
  }

  const html = await response.text();
  const parsed = new URL(url);
  const title =
    parseMetaContent(html, 'og:title') ||
    parseTitleTag(html) ||
    'Article';
  const image =
    parseMetaContent(html, 'og:image') ||
    parseMetaContent(html, 'twitter:image');
  const category =
    parseMetaContent(html, 'og:site_name') ||
    hostnameToCategory(parsed.hostname);
  const publishedAt =
    parsePublishedAt(parseMetaContent(html, 'article:published_time')) ||
    parsePublishedAt(parseMetaContent(html, 'og:updated_time'));

  if (!image) {
    throw new Error(
      'No og:image found. Add the image manually or pick a URL that exposes Open Graph metadata.'
    );
  }

  return { title, image, category, publishedAt };
}

export async function downloadArticleImage(imageUrl, slug) {
  const response = await fetch(imageUrl, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to download og:image (${response.status})`);
  }

  const ext =
    extensionFromUrl(imageUrl) ||
    extensionFromContentType(response.headers.get('content-type'));
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  const filename = `${slug}${ext}`;
  const absolutePath = path.join(ARTICLES_DIR, filename);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(absolutePath, buffer);

  return `assets/articles/${filename}`;
}

function renderDateLine(article, innerPad) {
  if (!article.publishedAt) return '';
  const label = formatPublishedDate(article.publishedAt);
  return `${innerPad}  <time class="video-date" datetime="${escapeHtml(article.publishedAt)}">${escapeHtml(label)}</time>\n`;
}

function renderCard(article, size, comment, indent) {
  const cardClass = size === 'horizontal' ? 'video-card-horizontal' : 'video-card-small';
  const pad = ' '.repeat(indent);
  const innerPad = pad + '  ';
  const titleAttr = escapeHtml(article.title);
  const urlAttr = escapeHtml(article.url);
  const commentLine = comment ? `${pad}<!-- ${comment} -->\n` : '';

  return `${commentLine}${pad}<article class="video-card ${cardClass}">
${innerPad}<a href="${urlAttr}" target="_blank" rel="noopener noreferrer" class="work-card-link">
${innerPad}  <div class="video-thumbnail video-thumbnail-16-9">
${innerPad}    <img src="${escapeHtml(article.image)}" alt="${titleAttr}" loading="lazy" width="640" height="360">
${innerPad}  </div>
${innerPad}  <div class="video-info">
${innerPad}    <span class="video-category">${escapeHtml(article.category)}</span>
${renderDateLine(article, innerPad)}${innerPad}    <h3 class="video-card-title">${escapeHtml(article.title)}</h3>
${innerPad}  </div>
${innerPad}</a>
${pad}</article>`;
}

export function renderFeaturedArticlesHtml(articles) {
  const featured = articles.slice(0, 5);
  const lines = [];
  const featuredComments = [
    'Horizontal Article Card 1',
    'Horizontal Article Card 2',
    'Small Article Card 1',
    'Small Article Card 2',
    'Small Article Card 3',
  ];
  const featuredSizes = ['horizontal', 'horizontal', 'small', 'small', 'small'];

  for (let i = 0; i < featured.length; i++) {
    lines.push(
      renderCard(featured[i], featuredSizes[i], featuredComments[i], 10)
    );
  }

  return lines.join('\n');
}

export function renderMoreArticlesHtml(articles) {
  const archived = articles.slice(5);
  const lines = [
    '        <div class="more-section" id="more-articles" style="display: none;">',
    '          <div class="video-grid">',
    '            <!-- Archived articles appear here -->',
  ];

  for (const article of archived) {
    lines.push(renderCard(article, 'small', null, 12));
  }

  lines.push('          </div>');
  lines.push('        </div>');

  return lines.join('\n');
}

function replaceMarkedSection(html, startMarker, endMarker, content) {
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `Markers not found in index.html. Expected ${startMarker} and ${endMarker}`
    );
  }

  const before = html.slice(0, startIdx + startMarker.length);
  const after = html.slice(endIdx);
  const body = content ? `\n${content}\n          ` : '\n          ';
  return before + body + after;
}

export function updateIndexHtml() {
  const articles = readArticles();
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  html = replaceMarkedSection(
    html,
    START_MARKER,
    END_MARKER,
    renderFeaturedArticlesHtml(articles)
  );
  html = replaceMarkedSection(
    html,
    MORE_START_MARKER,
    MORE_END_MARKER,
    renderMoreArticlesHtml(articles)
  );
  fs.writeFileSync(INDEX_HTML, html);
}
