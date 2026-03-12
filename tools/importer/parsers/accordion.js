/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion. Base: accordion.
 * Source: https://www.vodafone.es/c/particulares/es/productos-y-servicios/
 * Selector: .ws10-m-accordion
 * Structure: 2-column table. Each row = [question title, answer content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each accordion item lives inside an <li> in the accordion list group
  const items = element.querySelectorAll('.ws10-m-accordion__list-group-list > li');

  items.forEach((item) => {
    // Question: h3 title inside the button header
    const titleEl = item.querySelector('h3.ws10-c-accordion-list__title, [class*="ws10-c-accordion-list__title"]');
    // Answer: content inside the collapse panel article
    const answerEl = item.querySelector('article.ws10-o-collapse-panel, [class*="ws10-o-collapse-panel"]');

    if (!titleEl) return;

    // Build question cell
    const questionCell = [];
    const h3 = document.createElement('h3');
    h3.textContent = titleEl.textContent.trim();
    questionCell.push(h3);

    // Build answer cell - preserve rich content (links, bold, lists, tables)
    const answerCell = [];
    if (answerEl) {
      // Process child elements of the answer panel
      const children = answerEl.querySelectorAll(':scope > p, :scope > div, :scope > ul, :scope > ol, :scope > table');
      if (children.length > 0) {
        children.forEach((child) => {
          const clone = child.cloneNode(true);
          answerCell.push(clone);
        });
      } else {
        // Fallback: get all text content if no block-level children
        const p = document.createElement('p');
        p.textContent = answerEl.textContent.trim();
        if (p.textContent) answerCell.push(p);
      }
    }

    if (answerCell.length > 0) {
      cells.push([questionCell, answerCell]);
    } else {
      cells.push([questionCell, '']);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
