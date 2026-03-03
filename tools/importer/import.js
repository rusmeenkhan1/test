/*
 * Vodafone Spain - Page Import Script
 * Handles migration of vodafone.es consumer pages to AEM Edge Delivery Services
 */

const VODAFONE_BASE = 'https://www.vodafone.es';

/**
 * Clean up text content from Vodafone source
 */
function cleanText(text) {
  return text?.replace(/\s+/g, ' ').trim() || '';
}

/**
 * Resolve relative URLs to absolute Vodafone URLs
 */
function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${VODAFONE_BASE}${url}`;
  return url;
}

/**
 * Parse hero carousel section
 */
function parseHeroCarousel(section) {
  const slides = section.querySelectorAll('[class*="card-discovery"], [class*="carousel-slide"], li');
  const rows = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const badge = slide.querySelector('[class*="badge"], [class*="tag"]');
    const heading = slide.querySelector('strong, h2, h3');
    const description = slide.querySelector('p:not(:has(strong))');
    const price = slide.querySelector('[class*="price"]');
    const links = slide.querySelectorAll('a');

    const imageCol = img ? `![${img.alt || ''}](${resolveUrl(img.src)})` : '';
    let textCol = '';
    if (badge) textCol += `**${cleanText(badge.textContent)}** `;
    if (heading) textCol += `**${cleanText(heading.textContent)}** `;
    if (description) textCol += `${cleanText(description.textContent)} `;
    if (price) textCol += `**${cleanText(price.textContent)}** `;
    links.forEach((link) => {
      textCol += `[${cleanText(link.textContent)}](${resolveUrl(link.href)}) `;
    });

    if (imageCol || textCol) {
      rows.push({ image: imageCol, text: textCol.trim() });
    }
  });

  return { blockName: 'Carousel', rows, type: 'two-column' };
}

/**
 * Parse pricing cards section
 */
function parsePricingCards(section) {
  const cards = section.querySelectorAll('[class*="card"], [class*="tarifa"]');
  const rows = [];

  cards.forEach((card) => {
    const label = card.querySelector('[class*="label"], [class*="badge"]');
    const price = card.querySelector('[class*="price"]');
    const features = card.querySelectorAll('li, [class*="feature"]');
    const links = card.querySelectorAll('a');

    let text = '';
    if (label) text += `**${cleanText(label.textContent)}** `;
    if (price) text += `**${cleanText(price.textContent)}** `;
    features.forEach((f) => { text += `${cleanText(f.textContent)} `; });
    links.forEach((link) => {
      text += `[${cleanText(link.textContent)}](${resolveUrl(link.href)}) `;
    });

    if (text.trim()) {
      rows.push({ text: text.trim() });
    }
  });

  return { blockName: 'Cards', rows, type: 'single-column' };
}

/**
 * Parse product category carousel
 */
function parseProductCategories(section) {
  const items = section.querySelectorAll('a[class*="image-strip"], a');
  const rows = [];

  items.forEach((item) => {
    const img = item.querySelector('img');
    const text = cleanText(item.textContent);
    const href = resolveUrl(item.href);

    if (img && text) {
      rows.push({
        image: `![${img.alt || text}](${resolveUrl(img.src)})`,
        text: `[${text}](${href})`,
      });
    }
  });

  return { blockName: 'Cards', rows, type: 'two-column' };
}

/**
 * Parse columns/split layout section
 */
function parseColumns(section) {
  const cols = section.querySelectorAll(':scope > div > div, [class*="column"]');
  const row = [];

  cols.forEach((col) => {
    const img = col.querySelector('img');
    const heading = col.querySelector('h2, h3, strong');
    const desc = col.querySelector('p');
    const link = col.querySelector('a');

    let content = '';
    if (img) content += `![${img.alt || ''}](${resolveUrl(img.src)}) `;
    if (heading) content += `**${cleanText(heading.textContent)}** `;
    if (desc) content += `${cleanText(desc.textContent)} `;
    if (link) content += `[${cleanText(link.textContent)}](${resolveUrl(link.href)})`;

    if (content.trim()) {
      row.push(content.trim());
    }
  });

  return { blockName: 'Columns', row, type: 'multi-column' };
}

/**
 * Extract page metadata
 */
function extractMetadata(document) {
  const title = document.querySelector('title')?.textContent || '';
  const description = document.querySelector('meta[name="description"]')?.content || '';
  const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';

  return { title, description, 'og:image': ogImage };
}

/**
 * Main import transformation
 */
export default function transform(document) {
  const main = document.querySelector('main, [role="main"]');
  if (!main) return null;

  const sections = [];
  const metadata = extractMetadata(document);

  // Process each top-level section in main
  const { children } = main;
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const text = cleanText(child.textContent);

    // Skip empty sections
    if (!text) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // Detect section type based on content patterns
    const hasCarousel = child.querySelector('[class*="carousel"], [class*="discovery"]');
    const hasPricingCards = child.querySelector('[class*="pricing"], [class*="tarifa"]');
    const hasImageStrip = child.querySelector('[class*="image-strip"]');
    const hasColumns = child.querySelector('[class*="column"], [class*="split"]');
    const heading = child.querySelector('h2');

    if (hasCarousel && i === 0) {
      sections.push(parseHeroCarousel(child));
    } else if (hasPricingCards) {
      sections.push(parsePricingCards(child));
    } else if (hasImageStrip) {
      sections.push(parseProductCategories(child));
    } else if (hasColumns) {
      sections.push(parseColumns(child));
    } else if (heading) {
      sections.push({ type: 'default', content: `## **${cleanText(heading.textContent)}**` });
    }
  }

  return { sections, metadata };
}
