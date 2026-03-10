/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Vodafone Spain site cleanup.
 * Selectors from captured DOM of https://www.vodafone.es/c/particulares/es/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
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

  if (hookName === TransformHook.afterTransform) {
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
