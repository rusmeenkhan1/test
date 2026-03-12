var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-fibra-optica-product.js
  var import_fibra_optica_product_exports = {};
  __export(import_fibra_optica_product_exports, {
    default: () => import_fibra_optica_product_default
  });

  // tools/importer/parsers/cards.js
  function parse(element, { document }) {
    const cells = [];
    const isRateList = element.classList.contains("ws10-m-card-rate-list") || element.querySelector(".ws10-m-card-rate-simple");
    const isImageStrip = element.classList.contains("ws10-c-image-strip-element");
    const isAddons = (element.getAttribute("class") || "").includes("ws10-m-addons") || element.querySelector('[class*="ws10-c-card-addons"]');
    const isHifi = element.classList.contains("ws10-m-module-hifi") || element.querySelector(".ws10-m-module-hifi__item");
    if (isRateList) {
      const rateCards = element.querySelectorAll(".ws10-m-card-rate-simple");
      rateCards.forEach((card) => {
        const contentCell = [];
        const outstanding = card.querySelector('[class*="ws10-c-label-card__outstanding"]');
        if (outstanding) {
          const p = document.createElement("p");
          p.innerHTML = "<em>" + outstanding.textContent.trim() + "</em>";
          contentCell.push(p);
        }
        const pill = card.querySelector('[class*="ws10-c-pill"]');
        if (pill) {
          const p = document.createElement("p");
          p.innerHTML = "<em>" + pill.textContent.trim() + "</em>";
          contentCell.push(p);
        }
        const priceAmount = card.querySelector('[class*="ws10-c-price__amount"]');
        const priceRecurrence = card.querySelector('[class*="ws10-c-price__recurrence"]');
        if (priceAmount) {
          const p = document.createElement("p");
          p.innerHTML = "<strong>" + priceAmount.textContent.trim() + (priceRecurrence ? priceRecurrence.textContent.trim() : "") + "</strong>";
          contentCell.push(p);
        }
        const priceNote = card.querySelector('[class*="ws10-c-price__text"]');
        if (priceNote && priceNote.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = priceNote.textContent.trim();
          contentCell.push(p);
        }
        const features = card.querySelectorAll('li[class*="ws10-flex"]');
        if (features.length > 0) {
          const ul = document.createElement("ul");
          features.forEach((f) => {
            const li = document.createElement("li");
            li.textContent = f.textContent.trim();
            if (li.textContent) ul.appendChild(li);
          });
          if (ul.children.length > 0) contentCell.push(ul);
        }
        const ctas = card.querySelectorAll('a[class*="ws10-c-button"]');
        ctas.forEach((cta) => {
          const text = cta.textContent.trim().replace(/\s+/g, " ");
          if (text) {
            const a = document.createElement("a");
            a.href = cta.href || "#";
            a.textContent = text;
            const p = document.createElement("p");
            p.appendChild(a);
            contentCell.push(p);
          }
        });
        if (contentCell.length > 0) {
          cells.push([contentCell]);
        }
      });
    } else if (isImageStrip) {
      const img = element.querySelector("img");
      const text = element.querySelector('[class*="image-strip-element__text"]');
      const link = element.closest("a") || element.querySelector("a");
      const contentCell = [];
      if (text) {
        const p = document.createElement("p");
        p.innerHTML = "<strong>" + text.textContent.trim() + "</strong>";
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || "#";
          a.innerHTML = p.innerHTML;
          const pLink = document.createElement("p");
          pLink.appendChild(a);
          contentCell.push(pLink);
        } else {
          contentCell.push(p);
        }
      }
      cells.push([img || "", contentCell]);
    } else if (isAddons) {
      const addonCards = element.querySelectorAll('[class*="ws10-c-card-addons"]');
      addonCards.forEach((card) => {
        const contentCell = [];
        const title = card.querySelector('[class*="ws10-c-card-addons__title"]');
        if (title) {
          const p = document.createElement("p");
          p.innerHTML = "<strong>" + title.textContent.trim() + "</strong>";
          contentCell.push(p);
        }
        const desc = card.querySelector('[class*="ws10-c-card-addons__paragraph"]');
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          contentCell.push(p);
        }
        const cta = card.querySelector('a[class*="ws10-c-button"]');
        if (cta) {
          const a = document.createElement("a");
          a.href = cta.href || "#";
          a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
          const p = document.createElement("p");
          p.appendChild(a);
          contentCell.push(p);
        }
        if (contentCell.length > 0) {
          cells.push([contentCell]);
        }
      });
    } else if (isHifi) {
      const items = element.querySelectorAll(".ws10-m-module-hifi__item");
      items.forEach((item) => {
        const contentCell = [];
        const title = item.querySelector('[class*="ws10-m-module-hifi__title"]');
        if (title) {
          const p = document.createElement("p");
          p.innerHTML = "<strong>" + title.textContent.trim() + "</strong>";
          contentCell.push(p);
        }
        const text = item.querySelector('[class*="ws10-m-module-hifi__text"]');
        if (text && text.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = text.textContent.trim();
          contentCell.push(p);
        }
        const cta = item.querySelector("a");
        if (cta) {
          const a = document.createElement("a");
          a.href = cta.href || "#";
          a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
          const p = document.createElement("p");
          p.appendChild(a);
          contentCell.push(p);
        }
        if (contentCell.length > 0) {
          cells.push([contentCell]);
        }
      });
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const cells = [];
    const isMobilePdp = element.classList.contains("ws10-m-mobile-pdp-one") || element.querySelector(".ws10-m-product-detail-simple");
    const isTextImage = element.classList.contains("ws10-m-text-image") || element.className.includes("ws10-m-text-image");
    const isHeaderSection = element.classList.contains("ws10-m-header-section") || element.className.includes("ws10-m-header-section");
    if (isMobilePdp) {
      const container = element.querySelector('[class*="ws10-m-product-detail-simple__container"]');
      const items = container ? container.querySelectorAll(".ws10-c-product-detail") : [];
      if (items.length > 0) {
        const row = [];
        items.forEach((item) => {
          const cellContent = [];
          const text = item.querySelector("p");
          if (text) {
            const p = document.createElement("p");
            p.textContent = text.textContent.trim();
            cellContent.push(p);
          }
          row.push(cellContent);
        });
        cells.push(row);
      }
    } else if (isHeaderSection) {
      const img = element.querySelector("img");
      const contentCol = [];
      const heading = element.querySelector("h2, h3");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        contentCol.push(h2);
      }
      const desc = element.querySelector('[class*="ws10-m-header-section__content-text"] p');
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCol.push(p);
      }
      const price = element.querySelector('[class*="ws10-m-header-section__price"]');
      if (price) {
        const p = document.createElement("p");
        p.innerHTML = "<strong>" + price.textContent.trim() + "</strong>";
        contentCol.push(p);
      }
      const cta = element.querySelector('a[class*="ws10-c-button"]');
      if (cta) {
        const a = document.createElement("a");
        a.href = cta.href || "#";
        a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
        const p = document.createElement("p");
        p.appendChild(a);
        contentCol.push(p);
      }
      cells.push([img || "", contentCol]);
    } else if (isTextImage) {
      const img = element.querySelector("img");
      const contentCol = [];
      const heading = element.querySelector("h2, h3");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        contentCol.push(h2);
      }
      const paragraphs = element.querySelectorAll('[class*="ws10-m-text-image__content-text"] p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          const para = document.createElement("p");
          para.textContent = p.textContent.trim();
          contentCol.push(para);
        }
      });
      const cta = element.querySelector('a[class*="ws10-c-button"]');
      if (cta) {
        const a = document.createElement("a");
        a.href = cta.href || "#";
        a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
        const p = document.createElement("p");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll(".ws10-c-carousel__list-element");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      const contentCell = [];
      const pill = slide.querySelector('[class*="ws10-c-pill"]');
      if (pill) {
        const p = document.createElement("p");
        p.innerHTML = "<em>" + pill.textContent.trim() + "</em>";
        contentCell.push(p);
      }
      const title = slide.querySelector('[class*="card-discovery-standard-medium-price__title"]');
      if (title) {
        const h2 = document.createElement("h2");
        h2.textContent = title.textContent.trim();
        contentCell.push(h2);
      }
      const texts = slide.querySelectorAll('[class*="card-discovery-standard-medium-price__text"]');
      texts.forEach((t) => {
        if (t.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = t.textContent.trim();
          contentCell.push(p);
        }
      });
      const priceAmount = slide.querySelector('[class*="ws10-c-price__amount"]');
      const priceRecurrence = slide.querySelector('[class*="ws10-c-price__recurrence"]');
      if (priceAmount) {
        const p = document.createElement("p");
        p.innerHTML = "<strong>" + priceAmount.textContent.trim() + (priceRecurrence ? priceRecurrence.textContent.trim() : "") + "</strong>";
        contentCell.push(p);
      }
      const ctas = slide.querySelectorAll('a[class*="ws10-c-button"]');
      ctas.forEach((cta) => {
        const text = cta.textContent.trim().replace(/\s+/g, " ");
        if (text) {
          const a = document.createElement("a");
          a.href = cta.href || "#";
          a.textContent = text;
          const p = document.createElement("p");
          p.appendChild(a);
          contentCell.push(p);
        }
      });
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse4(element, { document }) {
    const cells = [];
    const contentCell = [];
    const title = element.querySelector('[class*="ws10-c-banner-slim__title"]');
    if (title) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      contentCell.push(h2);
    }
    const text = element.querySelector('[class*="ws10-c-banner-slim__text"]');
    if (text) {
      const p = document.createElement("p");
      p.textContent = text.textContent.trim();
      contentCell.push(p);
    }
    const cta = element.querySelector('a[class*="ws10-c-button"]');
    if (cta) {
      const a = document.createElement("a");
      a.href = cta.href || "#";
      a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
      const p = document.createElement("p");
      p.appendChild(a);
      contentCell.push(p);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse5(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".ws10-m-accordion__list-group-list > li");
    items.forEach((item) => {
      const titleEl = item.querySelector('h3.ws10-c-accordion-list__title, [class*="ws10-c-accordion-list__title"]');
      const answerEl = item.querySelector('article.ws10-o-collapse-panel, [class*="ws10-o-collapse-panel"]');
      if (!titleEl) return;
      const questionCell = [];
      const h3 = document.createElement("h3");
      h3.textContent = titleEl.textContent.trim();
      questionCell.push(h3);
      const answerCell = [];
      if (answerEl) {
        const children = answerEl.querySelectorAll(":scope > p, :scope > div, :scope > ul, :scope > ol, :scope > table");
        if (children.length > 0) {
          children.forEach((child) => {
            const clone = child.cloneNode(true);
            answerCell.push(clone);
          });
        } else {
          const p = document.createElement("p");
          p.textContent = answerEl.textContent.trim();
          if (p.textContent) answerCell.push(p);
        }
      }
      if (answerCell.length > 0) {
        cells.push([questionCell, answerCell]);
      } else {
        cells.push([questionCell, ""]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vodafone-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const cookieSelectors = [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        '[id*="onetrust"]',
        '[class*="onetrust"]',
        '[class*="cookie"]',
        '[class*="consent"]',
        '[class*="overlay"]',
        '[class*="chat-widget"]',
        '[class*="gdpr"]',
        ".ot-sdk-container"
      ];
      try {
        WebImporter.DOMUtils.remove(element, cookieSelectors);
      } catch (e) {
      }
      cookieSelectors.forEach((sel) => {
        try {
          element.querySelectorAll(sel).forEach((el) => el.remove());
        } catch (e) {
        }
      });
      const doc = element.ownerDocument || payload.document;
      if (doc) {
        cookieSelectors.forEach((sel) => {
          try {
            doc.querySelectorAll(sel).forEach((el) => el.remove());
          } catch (e) {
          }
        });
      }
      element.querySelectorAll(".ws10-u--hidden-visually").forEach((el) => el.remove());
      element.querySelectorAll('img[src*="bat.bing.net"], img[src*="pixel.gif"], img[src*="neuronal"], img[src*="tracking"], img[src*="infunnel"]').forEach((el) => el.remove());
      element.querySelectorAll('img[src*="cookielaw.org"]').forEach((el) => el.remove());
      element.querySelectorAll('a[href="#content"], a[href="#main"]').forEach((el) => {
        const parent = el.closest("p, div, span");
        if (parent && parent.children.length <= 1) {
          parent.remove();
        } else {
          el.remove();
        }
      });
      element.querySelectorAll('button[class*="ws10-c-carousel__animated-bullet"]').forEach((el) => el.remove());
      element.querySelectorAll('button[class*="ws10-c-carousel__play"]').forEach((el) => el.remove());
      element.querySelectorAll(".ws10-c-carousel__animation-menu").forEach((el) => el.remove());
      element.querySelectorAll(".ws10-c-carousel__bullets").forEach((el) => el.remove());
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "scroll";
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "aside",
        "link",
        "noscript",
        "script",
        "style"
      ]);
      element.querySelectorAll("h2, h3, h4").forEach((heading) => {
        const text = heading.textContent.toLowerCase();
        if (text.includes("privacidad") || text.includes("cookies") || text.includes("cookie") || text.includes("consentimiento") || text.includes("consent")) {
          let container = heading.closest("div") || heading.parentElement;
          if (container) {
            container.remove();
          } else {
            heading.remove();
          }
        }
      });
      element.querySelectorAll('img[src*="bat.bing.net"], img[src*="pixel.gif"], img[src*="neuronal"], img[src*="tracking"], img[src*="infunnel"], img[src*="cookielaw.org"]').forEach((el) => {
        const parent = el.closest("p");
        if (parent && parent.querySelectorAll("img").length === parent.children.length) {
          parent.remove();
        } else {
          el.remove();
        }
      });
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-ws10-js");
        el.removeAttribute("data-ws10-js-point");
        el.removeAttribute("data-ws10-js-location");
        el.removeAttribute("data-ws10-js-locsub");
        el.removeAttribute("data-initialized");
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/vodafone-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-fibra-optica-product.js
  var parsers = {
    "cards": parse,
    "columns": parse2,
    "carousel": parse3,
    "hero": parse4,
    "accordion": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "fibra-optica-product",
    description: "Vodafone Spain fiber optic and ADSL broadband product page with pricing plans, speed options, and service configurations.",
    urls: [
      "https://www.vodafone.es/c/particulares/es/productos-y-servicios/fibra-optica-adsl/"
    ],
    blocks: [
      {
        name: "cards",
        instances: [
          ".ws10-m-card-rate-simple",
          ".ws10-c-card-addons"
        ]
      },
      {
        name: "columns",
        instances: [
          ".ws10-c-rates-icon-set"
        ]
      },
      {
        name: "carousel",
        instances: [
          ".ws10-c-card[class*='bg-gradient']"
        ]
      },
      {
        name: "hero",
        instances: [
          ".ws10-c-banner-slim"
        ]
      },
      {
        name: "accordion",
        instances: [
          ".ws10-m-accordion",
          ".ws10-c-accordion-list"
        ]
      }
    ],
    sections: [
      {
        id: "hero-pricing",
        name: "Hero with Pricing Cards",
        selector: ".ws10-m-card-rate-simple",
        style: null,
        blocks: ["cards"],
        defaultContent: ["h1"]
      },
      {
        id: "features-bar",
        name: "Features Bar",
        selector: ".ws10-c-rates-icon-set",
        style: "vodafone-dark",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "advantages-carousel",
        name: "Advantages Carousel",
        selector: ".ws10-c-card[class*='bg-gradient']",
        style: null,
        blocks: ["carousel"],
        defaultContent: ["h2"]
      },
      {
        id: "cta-banner",
        name: "CTA Banner",
        selector: ".ws10-c-banner-slim",
        style: "vodafone-red",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "steps-section",
        name: "Steps Section",
        selector: ".ws10-m-timeline-steps",
        style: null,
        blocks: ["cards"],
        defaultContent: ["h2"]
      },
      {
        id: "comparison-table",
        name: "Comparison Table",
        selector: ".ws10-m-new-table-comparative",
        style: null,
        blocks: [],
        defaultContent: ["h2", "table"]
      },
      {
        id: "seo-text",
        name: "SEO Text",
        selector: "[id='1500371068384']",
        style: null,
        blocks: [],
        defaultContent: ["h2", "p", "ul"]
      },
      {
        id: "legal-text",
        name: "Legal Text",
        selector: "a[href*='legales']",
        style: null,
        blocks: [],
        defaultContent: ["a"]
      },
      {
        id: "faq-accordion",
        name: "FAQ Accordion",
        selector: ".ws10-m-accordion",
        style: null,
        blocks: ["accordion"],
        defaultContent: ["h2"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_fibra_optica_product_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_fibra_optica_product_exports);
})();
