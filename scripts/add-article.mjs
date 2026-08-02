#!/usr/bin/env node
import {
  downloadArticleImage,
  extractSlug,
  fetchArticleMetadata,
  findArticleIndex,
  readArticles,
  updateIndexHtml,
  writeArticles,
} from './article-lib.mjs';

async function main() {
  const url = process.argv[2];
  const titleOverride = process.argv[3];
  const categoryOverride = process.argv[4];

  if (!url) {
    console.error(
      'Usage: node scripts/add-article.mjs <article-url> ["Custom Title"] ["Category Name"]'
    );
    process.exit(1);
  }

  const slug = extractSlug(url);
  const articles = readArticles();
  const existingIndex = findArticleIndex(articles, url);
  const metadata = await fetchArticleMetadata(url);
  const image = await downloadArticleImage(metadata.image, slug);

  const entry = {
    slug,
    url: new URL(url).toString().replace(/\/$/, ''),
    title: titleOverride || metadata.title,
    category: categoryOverride || metadata.category,
    image,
  };

  if (metadata.publishedAt) {
    entry.publishedAt = metadata.publishedAt;
  }

  if (existingIndex === -1) {
    articles.unshift(entry);
    writeArticles(articles);
    updateIndexHtml();
    console.log(`Added: ${entry.title}`);
    console.log(`Slug: ${slug}`);
    console.log('Position: Horizontal Article Card 1 (featured)');
    return;
  }

  const existing = articles[existingIndex];
  entry.publishedAt = entry.publishedAt || existing.publishedAt || undefined;
  if (!entry.publishedAt) {
    delete entry.publishedAt;
  }

  articles[existingIndex] = entry;
  writeArticles(articles);
  updateIndexHtml();
  console.log(`Updated: ${entry.title}`);
  console.log(`Slug: ${slug}`);
  console.log(`Position unchanged (index ${existingIndex})`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
