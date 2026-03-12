/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import carouselParser from './parsers/carousel.js';
import heroParser from './parsers/hero.js';
import accordionParser from './parsers/accordion.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/vodafone-cleanup.js';
import sectionsTransformer from './transformers/vodafone-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards': cardsParser,
  'columns': columnsParser,
  'carousel': carouselParser,
  'hero': heroParser,
  'accordion': accordionParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'fibra-optica-product',
  description: 'Vodafone Spain fiber optic and ADSL broadband product page with pricing plans, speed options, and service configurations.',
  urls: [
    'https://www.vodafone.es/c/particulares/es/productos-y-servicios/fibra-optica-adsl/'
  ],
  blocks: [
    {
      name: 'cards',
      instances: [
        '.ws10-m-card-rate-simple',
        '.ws10-c-card-addons'
      ]
    },
    {
      name: 'columns',
      instances: [
        '.ws10-c-rates-icon-set'
      ]
    },
    {
      name: 'carousel',
      instances: [
        ".ws10-c-card[class*='bg-gradient']"
      ]
    },
    {
      name: 'hero',
      instances: [
        '.ws10-c-banner-slim'
      ]
    },
    {
      name: 'accordion',
      instances: [
        '.ws10-m-accordion',
        '.ws10-c-accordion-list'
      ]
    }
  ],
  sections: [
    {
      id: 'hero-pricing',
      name: 'Hero with Pricing Cards',
      selector: '.ws10-m-card-rate-simple',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h1']
    },
    {
      id: 'features-bar',
      name: 'Features Bar',
      selector: '.ws10-c-rates-icon-set',
      style: 'vodafone-dark',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'advantages-carousel',
      name: 'Advantages Carousel',
      selector: ".ws10-c-card[class*='bg-gradient']",
      style: null,
      blocks: ['carousel'],
      defaultContent: ['h2']
    },
    {
      id: 'cta-banner',
      name: 'CTA Banner',
      selector: '.ws10-c-banner-slim',
      style: 'vodafone-red',
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'steps-section',
      name: 'Steps Section',
      selector: '.ws10-m-timeline-steps',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h2']
    },
    {
      id: 'comparison-table',
      name: 'Comparison Table',
      selector: '.ws10-m-new-table-comparative',
      style: null,
      blocks: [],
      defaultContent: ['h2', 'table']
    },
    {
      id: 'seo-text',
      name: 'SEO Text',
      selector: "[id='1500371068384']",
      style: null,
      blocks: [],
      defaultContent: ['h2', 'p', 'ul']
    },
    {
      id: 'legal-text',
      name: 'Legal Text',
      selector: "a[href*='legales']",
      style: null,
      blocks: [],
      defaultContent: ['a']
    },
    {
      id: 'faq-accordion',
      name: 'FAQ Accordion',
      selector: '.ws10-m-accordion',
      style: null,
      blocks: ['accordion'],
      defaultContent: ['h2']
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
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
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
