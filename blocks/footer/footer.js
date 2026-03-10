import { getMetadata, loadSections } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { decorateMain } from '../../scripts/scripts.js';

/**
 * Loads footer content, trying local HTML first then fragment as fallback.
 * @param {string} path The footer path
 * @returns {HTMLElement} The main element with footer content
 */
async function loadFooterContent(path) {
  // Try loading as a fragment first (standard approach)
  const fragment = await loadFragment(path);
  if (fragment) {
    // Check if fragment has the expected link grid content
    const h3s = fragment.querySelectorAll('h3');
    if (h3s.length > 0) return fragment;
  }

  // Fallback: fetch the full HTML page and extract main content
  const resp = await fetch(path);
  if (resp.ok) {
    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mainContent = doc.querySelector('main');
    if (mainContent) {
      const main = document.createElement('main');
      main.innerHTML = mainContent.innerHTML;
      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }

  return fragment;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer content
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFooterContent(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Decorate the link grid section (second section with h3 + ul pairs)
  const sections = footer.querySelectorAll('.section');
  if (sections.length >= 2) {
    const linkGridSection = sections[1];
    const wrapper = linkGridSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const headings = wrapper.querySelectorAll('h3');
      if (headings.length > 0) {
        const grid = document.createElement('div');
        grid.className = 'footer-link-grid';

        headings.forEach((h3) => {
          const col = document.createElement('div');
          col.className = 'footer-link-column';

          const title = document.createElement('button');
          title.className = 'footer-column-title';
          title.textContent = h3.textContent;
          title.setAttribute('aria-expanded', 'false');
          col.append(title);

          const ul = h3.nextElementSibling;
          if (ul && ul.tagName === 'UL') {
            ul.className = 'footer-column-links';
            col.append(ul);
          }

          grid.append(col);
        });

        wrapper.textContent = '';
        wrapper.append(grid);

        // Mobile accordion behavior
        grid.addEventListener('click', (e) => {
          const btn = e.target.closest('.footer-column-title');
          if (!btn || window.innerWidth >= 900) return;
          const col = btn.parentElement;
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          // Close all others
          grid.querySelectorAll('.footer-column-title').forEach((b) => {
            b.setAttribute('aria-expanded', 'false');
          });
          if (!expanded) {
            btn.setAttribute('aria-expanded', 'true');
          }
          col.querySelector('.footer-column-links')?.scrollIntoView({ block: 'nearest' });
        });
      }
    }
  }

  block.append(footer);
}
