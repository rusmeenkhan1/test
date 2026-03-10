/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns. Base: columns.
 * Source: https://www.vodafone.es/c/particulares/es/
 * Handles multiple source formats:
 *   - .ws10-m-mobile-pdp-one (icon feature columns - 3 cols)
 *   - .ws10-m-text-image (text + image split or heading-only)
 *   - .ws10-m-header-section (TV section: image + content, 2 cols)
 */
export default function parse(element, { document }) {
  const cells = [];

  const isMobilePdp = element.classList.contains('ws10-m-mobile-pdp-one') || element.querySelector('.ws10-m-product-detail-simple');
  const isTextImage = element.classList.contains('ws10-m-text-image') || element.className.includes('ws10-m-text-image');
  const isHeaderSection = element.classList.contains('ws10-m-header-section') || element.className.includes('ws10-m-header-section');

  if (isMobilePdp) {
    // Icon feature columns: 3 columns side by side
    const container = element.querySelector('[class*="ws10-m-product-detail-simple__container"]');
    const items = container ? container.querySelectorAll('.ws10-c-product-detail') : [];

    if (items.length > 0) {
      const row = [];
      items.forEach((item) => {
        const cellContent = [];
        const text = item.querySelector('p');
        if (text) {
          const p = document.createElement('p');
          p.textContent = text.textContent.trim();
          cellContent.push(p);
        }
        row.push(cellContent);
      });
      cells.push(row);
    }
  } else if (isHeaderSection) {
    // Vodafone TV section: image (col 1) + content (col 2)
    const img = element.querySelector('img');
    const contentCol = [];

    const heading = element.querySelector('h2, h3');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      contentCol.push(h2);
    }

    const desc = element.querySelector('[class*="ws10-m-header-section__content-text"] p');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCol.push(p);
    }

    const price = element.querySelector('[class*="ws10-m-header-section__price"]');
    if (price) {
      const p = document.createElement('p');
      p.innerHTML = '<strong>' + price.textContent.trim() + '</strong>';
      contentCol.push(p);
    }

    const cta = element.querySelector('a[class*="ws10-c-button"]');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href || '#';
      a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
      const p = document.createElement('p');
      p.appendChild(a);
      contentCol.push(p);
    }

    cells.push([img || '', contentCol]);
  } else if (isTextImage) {
    // Text + image split layout or heading-only
    const img = element.querySelector('img');
    const contentCol = [];

    const heading = element.querySelector('h2, h3');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      contentCol.push(h2);
    }

    const paragraphs = element.querySelectorAll('[class*="ws10-m-text-image__content-text"] p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        contentCol.push(para);
      }
    });

    const cta = element.querySelector('a[class*="ws10-c-button"]');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href || '#';
      a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
      const p = document.createElement('p');
      p.appendChild(a);
      contentCol.push(p);
    }

    if (img) {
      cells.push([img, contentCol]);
    } else if (contentCol.length > 0) {
      cells.push([contentCol]);
    }
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
