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

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import vodafoneCleanupTransformer from './transformers/vodafone-cleanup.js';
import vodafoneSectionsTransformer from './transformers/vodafone-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel': carouselParser,
  'hero': heroParser,
  'cards': cardsParser,
  'columns': columnsParser,
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
  vodafoneCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [vodafoneSectionsTransformer] : []),
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
export default {
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
