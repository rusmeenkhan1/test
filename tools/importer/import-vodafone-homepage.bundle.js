let CustomImportScript = (function () {
  /* eslint-disable */
  /* global WebImporter */
  /**
   * Parser for carousel. Base: carousel.
   * Source: https://www.vodafone.es/c/particulares/es/
   * Selector: .ws10-m-cards-discovery-standard-medium-price
   * Verified: selectors tested via Playwright on live page (4 slides found)
   */
  function parse$3(element, { document }) {
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

  /* eslint-disable */
  /* global WebImporter */
  /**
   * Parser for hero. Base: hero.
   * Source: https://www.vodafone.es/c/particulares/es/
   * Selector: .ws10-m-banner-slim
   * Structure: 1-column table. Row 1 = optional image. Row 2 = title + text + CTA.
   */
  function parse$2(element, { document }) {
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
  function parse$1(element, { document }) {
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
  function parse(element, { document }) {
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

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Transformer: Vodafone Spain site cleanup.
   * Selectors from captured DOM of https://www.vodafone.es/c/particulares/es/
   */
  const TransformHook$1 = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

  function transform$1(hookName, element, payload) {
    if (hookName === TransformHook$1.beforeTransform) {
      // Remove cookie/consent dialogs using both DOMUtils and direct DOM manipulation
      // DOMUtils.remove may not work in all import contexts, so we use both approaches
      const cookieSelectors = [
        '#onetrust-consent-sdk',
        '#onetrust-banner-sdk',
        '#onetrust-pc-sdk',
        '[id*="onetrust"]',
        '[class*="onetrust"]',
        '[class*="cookie"]',
        '[class*="consent"]',
        '[class*="overlay"]',
        '[class*="chat-widget"]',
        '[class*="gdpr"]',
        '.ot-sdk-container',
      ];

      // Try WebImporter.DOMUtils.remove first
      try {
        WebImporter.DOMUtils.remove(element, cookieSelectors);
      } catch (e) {
        // Fallback: direct DOM removal
      }

      // Also do direct DOM removal as belt-and-suspenders approach
      cookieSelectors.forEach((sel) => {
        try {
          element.querySelectorAll(sel).forEach((el) => el.remove());
        } catch (e) {
          // Ignore invalid selectors
        }
      });

      // Also try on the document root (elements may be outside the passed element)
      const doc = element.ownerDocument || payload.document;
      if (doc) {
        cookieSelectors.forEach((sel) => {
          try {
            doc.querySelectorAll(sel).forEach((el) => el.remove());
          } catch (e) {
            // Ignore
          }
        });
      }

      // Remove hidden-visually spans BEFORE parsers run (prevents "Texto overflow hidden" artifacts)
      element.querySelectorAll('.ws10-u--hidden-visually').forEach((el) => el.remove());

      // Remove tracking pixels (1x1 images from analytics services)
      element.querySelectorAll('img[src*="bat.bing.net"], img[src*="pixel.gif"], img[src*="neuronal"], img[src*="tracking"], img[src*="infunnel"]').forEach((el) => el.remove());
      // Also remove cookielaw.org images
      element.querySelectorAll('img[src*="cookielaw.org"]').forEach((el) => el.remove());

      // Remove skip-to-content / accessibility skip links (not authorable content)
      element.querySelectorAll('a[href="#content"], a[href="#main"]').forEach((el) => {
        const parent = el.closest('p, div, span');
        if (parent && parent.children.length <= 1) {
          parent.remove();
        } else {
          el.remove();
        }
      });

      // Remove carousel navigation buttons (not content)
      element.querySelectorAll('button[class*="ws10-c-carousel__animated-bullet"]').forEach((el) => el.remove());
      element.querySelectorAll('button[class*="ws10-c-carousel__play"]').forEach((el) => el.remove());
      element.querySelectorAll('.ws10-c-carousel__animation-menu').forEach((el) => el.remove());
      element.querySelectorAll('.ws10-c-carousel__bullets').forEach((el) => el.remove());

      // Fix overflow hidden on main to allow scrolling during import
      if (element.style && element.style.overflow === 'hidden') {
        element.style.overflow = 'scroll';
      }
    }

    if (hookName === TransformHook$1.afterTransform) {
      // Remove non-authorable: header, footer, nav, sidebar, breadcrumbs
      WebImporter.DOMUtils.remove(element, [
        'header',
        'footer',
        'nav',
        'aside',
        'link',
        'noscript',
        'script',
        'style',
      ]);

      // Remove any remaining cookie/privacy content that leaked through
      // Target by content patterns: headings containing privacy/cookie keywords
      element.querySelectorAll('h2, h3, h4').forEach((heading) => {
        const text = heading.textContent.toLowerCase();
        if (text.includes('privacidad') || text.includes('cookies') || text.includes('cookie') ||
            text.includes('consentimiento') || text.includes('consent')) {
          // Remove from the heading to the end of its container section
          let container = heading.closest('div') || heading.parentElement;
          if (container) {
            container.remove();
          } else {
            heading.remove();
          }
        }
      });

      // Remove remaining tracking pixels and cookielaw images
      element.querySelectorAll('img[src*="bat.bing.net"], img[src*="pixel.gif"], img[src*="neuronal"], img[src*="tracking"], img[src*="infunnel"], img[src*="cookielaw.org"]').forEach((el) => {
        const parent = el.closest('p');
        if (parent && parent.querySelectorAll('img').length === parent.children.length) {
          parent.remove();
        } else {
          el.remove();
        }
      });

      // Clean data attributes
      element.querySelectorAll('*').forEach((el) => {
        el.removeAttribute('data-ws10-js');
        el.removeAttribute('data-ws10-js-point');
        el.removeAttribute('data-ws10-js-location');
        el.removeAttribute('data-ws10-js-locsub');
        el.removeAttribute('data-initialized');
        el.removeAttribute('data-track');
        el.removeAttribute('onclick');
      });
    }
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Transformer: Vodafone Spain section breaks and section-metadata.
   * Runs in afterTransform only. Uses attribute selectors for numeric IDs.
   * Selectors from captured DOM of https://www.vodafone.es/c/particulares/es/
   */
  const TransformHook = { afterTransform: 'afterTransform' };

  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;

      const sections = template.sections;

      // Process sections in reverse order to avoid DOM position shifts
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }

        if (!sectionEl) continue;

        // Add section-metadata block if section has a style
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: 'Section Metadata',
            cells: { style: section.style },
          });
          sectionEl.after(metaBlock);
        }

        // Add section break (hr) before each section except the first
        if (i > 0) {
          const hr = document.createElement('hr');
          sectionEl.before(hr);
        }
      }
    }
  }

  /* eslint-disable */
  /* global WebImporter */

  // =====================================================================
  // MARKDOWN OUTPUT INTERCEPTOR
  // Wraps WebImporter.html2md to clean the generated markdown output.
  // This approach works regardless of how html2md internally caches or
  // clones the document, because we clean the OUTPUT not the INPUT.
  // =====================================================================
  (function markdownInterceptor() {
    try {
      if (typeof window !== 'undefined' && window.WebImporter && window.WebImporter.html2md) {
        var origHtml2md = window.WebImporter.html2md.bind(window.WebImporter);
        var wrappedHtml2md = function() {
          var result = origHtml2md.apply(this, arguments);
          // If result is a promise, handle async
          if (result && typeof result.then === 'function') {
            return result.then(function(res) {
              if (res && res.md) {
                res.md = cleanMarkdown(res.md);
                console.log('[EXCAT-IMPORT] Markdown cleaned via interceptor');
              }
              return res;
            });
          }
          if (result && result.md) {
            result.md = cleanMarkdown(result.md);
          }
          return result;
        };
        // Use Object.defineProperty since html2md may be a getter-only property
        try {
          Object.defineProperty(window.WebImporter, 'html2md', {
            value: wrappedHtml2md,
            writable: true,
            configurable: true,
          });
          console.log('[EXCAT-IMPORT] html2md interceptor installed via defineProperty');
        } catch(e2) {
          // If defineProperty also fails, try replacing the entire WebImporter object
          try {
            var newImporter = Object.create(Object.getPrototypeOf(window.WebImporter));
            Object.getOwnPropertyNames(window.WebImporter).forEach(function(key) {
              if (key === 'html2md') {
                Object.defineProperty(newImporter, 'html2md', {
                  value: wrappedHtml2md,
                  writable: true,
                  configurable: true,
                });
              } else {
                try {
                  newImporter[key] = window.WebImporter[key];
                } catch(e3) {
                  Object.defineProperty(newImporter, key, Object.getOwnPropertyDescriptor(window.WebImporter, key));
                }
              }
            });
            window.WebImporter = newImporter;
            console.log('[EXCAT-IMPORT] html2md interceptor installed via object replacement');
          } catch(e4) {
            console.error('[EXCAT-IMPORT] Failed to install interceptor:', e4);
          }
        }
      } else {
        console.warn('[EXCAT-IMPORT] WebImporter.html2md not found - interceptor not installed');
      }
    } catch(e) {
      console.error('[EXCAT-IMPORT] Interceptor install error:', e);
    }

    function cleanMarkdown(md) {
      var lines = md.split('\n');
      var cleanLines = [];
      var skipUntilNextBlock = false;

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var lower = line.toLowerCase();

        // Skip cookie consent / privacy content blocks
        if (lower.indexOf('valoramos tu privacidad') !== -1 ||
            lower.indexOf('ya sabes') !== -1 && lower.indexOf('cookies') !== -1 ||
            lower.indexOf('utilizamos cookies') !== -1 ||
            lower.indexOf('gestionar cookies') !== -1 ||
            lower.indexOf('rechazar cookies') !== -1 ||
            lower.indexOf('aceptar cookies') !== -1 ||
            lower.indexOf('cookie settings') !== -1 ||
            lower.indexOf('privacy preferences') !== -1 ||
            lower.indexOf('cookielaw.org') !== -1 ||
            lower.indexOf('optanon') !== -1 ||
            lower.indexOf('onetrust') !== -1) {
          skipUntilNextBlock = true;
          continue;
        }

        // Reset skip flag on section breaks or block tables
        if (skipUntilNextBlock && (line.trim() === '---' || line.match(/^\|/) || line.trim() === '')) {
          if (line.trim() === '---' || line.match(/^\|/)) {
            skipUntilNextBlock = false;
          }
          if (line.trim() === '') continue;
        }
        if (skipUntilNextBlock) continue;

        // Remove "Texto overflow hidden" artifacts
        line = line.replace(/Texto overflow hidden/gi, '');

        // Remove tracking pixel image references
        if (lower.indexOf('bat.bing.net') !== -1 ||
            lower.indexOf('pixel.gif') !== -1 ||
            lower.indexOf('neuronal') !== -1 ||
            lower.indexOf('infunnel') !== -1 ||
            lower.indexOf('cookielaw.org') !== -1) {
          continue;
        }

        // Remove lines that are just "×" or "..." (leaked dialog buttons)
        var trimmed = line.trim();
        if (trimmed === '×' || trimmed === '...' || trimmed === 'OK' ||
            trimmed === '× ...' || trimmed === '× ... OK') {
          continue;
        }

        // Remove skip-to-content text
        if (lower.indexOf('saltar al contenido') !== -1 ||
            lower.indexOf('skip to content') !== -1 ||
            lower.indexOf('skip to main') !== -1) {
          continue;
        }

        // Skip empty image references (tracking pixels leave behind empty img tags)
        if (line.match(/^!\[\]\(https?:\/\/[^)]*(?:bat\.bing|pixel\.gif|neuronal|infunnel|cookielaw)/)) {
          continue;
        }

        cleanLines.push(line);
      }

      // Remove consecutive blank lines (left from removed content)
      var result = cleanLines.join('\n');
      result = result.replace(/\n{3,}/g, '\n\n');
      return result;
    }
  })();

  // PARSER REGISTRY
  const parsers = {
    'carousel': parse$3,
    'hero': parse$2,
    'cards': parse$1,
    'columns': parse,
  };

  // PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
  const PAGE_TEMPLATE = {
    name: 'Vodafone Homepage',
    description: 'Main Vodafone Spain consumer homepage with hero carousel, pricing cards, product categories, promotional banners, entertainment section, benefits and plan selection.',
    urls: [
      'https://www.vodafone.es/c/particulares/es/'
    ],
    blocks: [
      {
        name: 'carousel',
        instances: [
          '.ws10-m-cards-discovery-standard-medium-price'
        ]
      },
      {
        name: 'hero',
        instances: [
          '.ws10-m-banner-slim'
        ]
      },
      {
        name: 'cards',
        instances: [
          '.ws10-m-card-rate-list',
          '.ws10-c-image-strip-element',
          "[class*='ws10-c-card-addons']",
          '.ws10-m-module-hifi'
        ]
      },
      {
        name: 'columns',
        instances: [
          '.ws10-m-mobile-pdp-one',
          '.ws10-m-text-image',
          '.ws10-m-header-section'
        ]
      }
    ],
    sections: [
      { id: 'hero-carousel', name: 'Hero Carousel', selector: "[id='1500291321140']", style: null, blocks: ['carousel'], defaultContent: [] },
      { id: 'cta-banner', name: 'Configure CTA Banner', selector: "[id='1500274593285']", style: null, blocks: ['hero'], defaultContent: [] },
      { id: 'pricing-cards', name: 'Pricing Cards', selector: "[id='1500274808009']", style: null, blocks: ['cards'], defaultContent: [] },
      { id: 'devices-header', name: 'Devices Header', selector: '.ws10-m-mobile-pdp-one', style: 'light-grey', blocks: ['columns'], defaultContent: ['.ws10-c-title-standard'] },
      { id: 'product-categories', name: 'Product Category Carousel', selector: '.ws10-m-carousel-secondary', style: 'light-grey', blocks: ['cards'], defaultContent: [] },
      { id: 'plan-amigo', name: 'Plan Amigo Banner', selector: '.ws10-m-text-image', style: 'light-grey', blocks: ['columns'], defaultContent: [] },
      { id: 'entertainment-heading', name: 'Entertainment Heading', selector: "[id='1500274630799']", style: 'light-grey', blocks: [], defaultContent: ['.ws10-c-title-standard'] },
      { id: 'vodafone-tv', name: 'Vodafone TV', selector: '.ws10-m-header-section', style: 'dark', blocks: ['columns'], defaultContent: [] },
      { id: 'benefits', name: 'Benefits Cards', selector: "[class*='ws10-m-addons']", style: null, blocks: ['cards'], defaultContent: ['.ws10-c-title-standard'] },
      { id: 'choose-plan', name: 'Choose Your Plan', selector: '.ws10-m-module-hifi', style: null, blocks: ['cards'], defaultContent: ['.ws10-c-title-standard'] },
      { id: 'legal', name: 'Legal Link', selector: "[id='1500274604051']", style: null, blocks: [], defaultContent: ["a[href*='legales']"] },
    ]
  };

  // TRANSFORMER REGISTRY
  const transformers = [
    transform$1,
    ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform] : []),
  ];

  /**
   * Execute all page transformers for a specific hook
   */
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE,
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }

  /**
   * Find all blocks on the page based on the embedded template configuration
   */
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
          });
        });
      });
    });
    return pageBlocks;
  }

  // EXPORT DEFAULT CONFIGURATION
  var importVodafoneHomepage = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;

      // 1. Execute beforeTransform transformers
      executeTransformers('beforeTransform', main, payload);

      // 2. Find blocks on page using embedded template
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

      // 3. Parse each block using registered parsers
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });

      // 4. Execute afterTransform transformers (final cleanup + section breaks)
      executeTransformers('afterTransform', main, payload);

      // 5. Direct content cleanup (belt-and-suspenders for cookie/tracking content)
      // Remove elements by content pattern - catches content that DOM selectors miss
      main.querySelectorAll('h2, h3, h4').forEach((heading) => {
        const text = (heading.textContent || '').toLowerCase();
        if (text.includes('privacidad') || text.includes('cookies') || text.includes('cookie') ||
            text.includes('consentimiento') || text.includes('consent')) {
          // Remove the heading and all following siblings until next section break
          let node = heading;
          while (node) {
            const next = node.nextSibling;
            node.remove();
            node = next;
          }
        }
      });

      // Remove tracking pixel images
      main.querySelectorAll('img').forEach((img) => {
        const src = (img.getAttribute('src') || '').toLowerCase();
        if (src.includes('bat.bing.net') || src.includes('pixel.gif') || src.includes('neuronal') ||
            src.includes('infunnel') || src.includes('cookielaw.org') || src.includes('tracking')) {
          const parent = img.closest('p');
          if (parent) {
            parent.remove();
          } else {
            img.remove();
          }
        }
      });

      // Remove OneTrust/cookie containers directly from document
      ['#onetrust-consent-sdk', '#onetrust-banner-sdk', '#onetrust-pc-sdk',
       '[id*="onetrust"]', '[class*="onetrust"]'].forEach((sel) => {
        try { document.querySelectorAll(sel).forEach((el) => el.remove()); } catch (e) { /* ignore */ }
      });

      // Remove empty paragraphs left after cleanup
      main.querySelectorAll('p').forEach((p) => {
        if (!p.textContent.trim() && !p.querySelector('img, a')) {
          p.remove();
        }
      });

      // 6. Apply WebImporter built-in rules
      const hr = document.createElement('hr');
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

      // 7. Generate sanitized path
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
      );

      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name),
        },
      }];
    },
  };

  return importVodafoneHomepage;

}());
if (typeof CustomImportScript !== "undefined" && !CustomImportScript.default) { CustomImportScript = { default: CustomImportScript }; }
