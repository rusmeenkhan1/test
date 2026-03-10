/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel. Base: carousel.
 * Source: https://www.vodafone.es/c/particulares/es/
 * Selector: .ws10-m-cards-discovery-standard-medium-price
 * Verified: selectors tested via Playwright on live page (4 slides found)
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.ws10-c-carousel__list-element');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const contentCell = [];

    const pill = slide.querySelector('[class*="ws10-c-pill"]');
    if (pill) {
      const p = document.createElement('p');
      p.innerHTML = '<em>' + pill.textContent.trim() + '</em>';
      contentCell.push(p);
    }

    const title = slide.querySelector('[class*="card-discovery-standard-medium-price__title"]');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      contentCell.push(h2);
    }

    const texts = slide.querySelectorAll('[class*="card-discovery-standard-medium-price__text"]');
    texts.forEach((t) => {
      if (t.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = t.textContent.trim();
        contentCell.push(p);
      }
    });

    const priceAmount = slide.querySelector('[class*="ws10-c-price__amount"]');
    const priceRecurrence = slide.querySelector('[class*="ws10-c-price__recurrence"]');
    if (priceAmount) {
      const p = document.createElement('p');
      p.innerHTML = '<strong>' + priceAmount.textContent.trim() + (priceRecurrence ? priceRecurrence.textContent.trim() : '') + '</strong>';
      contentCell.push(p);
    }

    const ctas = slide.querySelectorAll('a[class*="ws10-c-button"]');
    ctas.forEach((cta) => {
      const text = cta.textContent.trim().replace(/\s+/g, ' ');
      if (text) {
        const a = document.createElement('a');
        a.href = cta.href || '#';
        a.textContent = text;
        const p = document.createElement('p');
        p.appendChild(a);
        contentCell.push(p);
      }
    });

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
