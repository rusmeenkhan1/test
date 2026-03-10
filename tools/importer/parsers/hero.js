/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero. Base: hero.
 * Source: https://www.vodafone.es/c/particulares/es/
 * Selector: .ws10-m-banner-slim
 * Structure: 1-column table. Row 1 = optional image. Row 2 = title + text + CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Content row: title + description + CTA
  const contentCell = [];

  const title = element.querySelector('[class*="ws10-c-banner-slim__title"]');
  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    contentCell.push(h2);
  }

  const text = element.querySelector('[class*="ws10-c-banner-slim__text"]');
  if (text) {
    const p = document.createElement('p');
    p.textContent = text.textContent.trim();
    contentCell.push(p);
  }

  const cta = element.querySelector('a[class*="ws10-c-button"]');
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.href || '#';
    a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
    const p = document.createElement('p');
    p.appendChild(a);
    contentCell.push(p);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
