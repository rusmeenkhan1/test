/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards. Base: cards.
 * Source: https://www.vodafone.es/c/particulares/es/
 * Handles multiple card source formats:
 *   - .ws10-m-card-rate-list (pricing cards, 2-col with image placeholder)
 *   - .ws10-c-image-strip-element (product category cards with images)
 *   - [class*='ws10-c-card-addons'] (benefit/addon cards, no-images variant)
 *   - .ws10-m-module-hifi (feature highlight cards, no-images variant)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which card format we have
  const isRateList = element.classList.contains('ws10-m-card-rate-list') || element.querySelector('.ws10-m-card-rate-simple');
  const isImageStrip = element.classList.contains('ws10-c-image-strip-element');
  const isAddons = (element.getAttribute('class') || '').includes('ws10-m-addons') || element.querySelector('[class*="ws10-c-card-addons"]');
  const isHifi = element.classList.contains('ws10-m-module-hifi') || element.querySelector('.ws10-m-module-hifi__item');

  if (isRateList) {
    // Pricing rate cards: each .ws10-m-card-rate-simple is a card
    const rateCards = element.querySelectorAll('.ws10-m-card-rate-simple');
    rateCards.forEach((card) => {
      const contentCell = [];

      // Outstanding badge (e.g., "La más vendida")
      const outstanding = card.querySelector('[class*="ws10-c-label-card__outstanding"]');
      if (outstanding) {
        const p = document.createElement('p');
        p.innerHTML = '<em>' + outstanding.textContent.trim() + '</em>';
        contentCell.push(p);
      }

      // Pill/label
      const pill = card.querySelector('[class*="ws10-c-pill"]');
      if (pill) {
        const p = document.createElement('p');
        p.innerHTML = '<em>' + pill.textContent.trim() + '</em>';
        contentCell.push(p);
      }

      // Price
      const priceAmount = card.querySelector('[class*="ws10-c-price__amount"]');
      const priceRecurrence = card.querySelector('[class*="ws10-c-price__recurrence"]');
      if (priceAmount) {
        const p = document.createElement('p');
        p.innerHTML = '<strong>' + priceAmount.textContent.trim() + (priceRecurrence ? priceRecurrence.textContent.trim() : '') + '</strong>';
        contentCell.push(p);
      }

      // Price note
      const priceNote = card.querySelector('[class*="ws10-c-price__text"]');
      if (priceNote && priceNote.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = priceNote.textContent.trim();
        contentCell.push(p);
      }

      // Features list
      const features = card.querySelectorAll('li[class*="ws10-flex"]');
      if (features.length > 0) {
        const ul = document.createElement('ul');
        features.forEach((f) => {
          const li = document.createElement('li');
          li.textContent = f.textContent.trim();
          if (li.textContent) ul.appendChild(li);
        });
        if (ul.children.length > 0) contentCell.push(ul);
      }

      // CTAs
      const ctas = card.querySelectorAll('a[class*="ws10-c-button"]');
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

      if (contentCell.length > 0) {
        cells.push([contentCell]);
      }
    });
  } else if (isImageStrip) {
    // Single image strip element - this is one card
    const img = element.querySelector('img');
    const text = element.querySelector('[class*="image-strip-element__text"]');
    const link = element.closest('a') || element.querySelector('a');
    const contentCell = [];

    if (text) {
      const p = document.createElement('p');
      p.innerHTML = '<strong>' + text.textContent.trim() + '</strong>';
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || '#';
        a.innerHTML = p.innerHTML;
        const pLink = document.createElement('p');
        pLink.appendChild(a);
        contentCell.push(pLink);
      } else {
        contentCell.push(p);
      }
    }

    cells.push([img || '', contentCell]);
  } else if (isAddons) {
    // Addon/benefit cards (no images variant)
    const addonCards = element.querySelectorAll('[class*="ws10-c-card-addons"]');
    addonCards.forEach((card) => {
      const contentCell = [];
      const title = card.querySelector('[class*="ws10-c-card-addons__title"]');
      if (title) {
        const p = document.createElement('p');
        p.innerHTML = '<strong>' + title.textContent.trim() + '</strong>';
        contentCell.push(p);
      }
      const desc = card.querySelector('[class*="ws10-c-card-addons__paragraph"]');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      const cta = card.querySelector('a[class*="ws10-c-button"]');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.href || '#';
        a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
        const p = document.createElement('p');
        p.appendChild(a);
        contentCell.push(p);
      }
      if (contentCell.length > 0) {
        cells.push([contentCell]);
      }
    });
  } else if (isHifi) {
    // Module hifi cards (no images variant)
    const items = element.querySelectorAll('.ws10-m-module-hifi__item');
    items.forEach((item) => {
      const contentCell = [];
      const title = item.querySelector('[class*="ws10-m-module-hifi__title"]');
      if (title) {
        const p = document.createElement('p');
        p.innerHTML = '<strong>' + title.textContent.trim() + '</strong>';
        contentCell.push(p);
      }
      const text = item.querySelector('[class*="ws10-m-module-hifi__text"]');
      if (text && text.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = text.textContent.trim();
        contentCell.push(p);
      }
      const cta = item.querySelector('a');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.href || '#';
        a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
        const p = document.createElement('p');
        p.appendChild(a);
        contentCell.push(p);
      }
      if (contentCell.length > 0) {
        cells.push([contentCell]);
      }
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
