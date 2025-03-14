// The root element to start looking for headings.
// This depends on websites. If a website is missing from this list,
// the default root element is document.body.
// The object key is the start of the website URL.
// The value is a function that takes the URL and returns the selector.
const ROOT_SELECTORS = {
  "https://learn.microsoft.com/": () => ".content",
  "https://review.learn.microsoft.com/": () => ".content",
  "https://developer.chrome.com/docs/": () => "main",
  "https://github.com/": url => {
    if (url.endsWith(".md") || url.includes(".md#")) {
      return "article";
    }
    return "body";
  },
  "https://www.w3.org/blog": () => "main article",
};

// The headings to look for by default, unless different selectors
// are provided in HEADING_SELECTORS.
const DEFAULT_HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";

// The headings to find within the root element.
// This depends on websites. If a website is missing from this list,
// the default headings are those in DEFAULT_HEADING_SELECTOR.
// The object key is the start of the website URL.
// The value is a function that takes the URL and returns the headings selector.
const HEADING_SELECTORS = {
  // For these sites, there's only one real h1, the page title, so we only show h2 and below.
  "https://learn.microsoft.com/": () => "h2, h3, h4, h5, h6",
  "https://review.learn.microsoft.com/": () => "h2, h3, h4, h5, h6",
  "https://developer.chrome.com/docs/": () => "h2, h3, h4, h5, h6"
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "generate-toc") {
    generateTOC(sendResponse);
  } else if (msg.action === "jump-to") {
    jumpTo(msg.id);
  }
});

// Get the root node to start looking for headings.
function getRootNode() {
  const location = document.location.href;

  for (const [site, selector] of Object.entries(ROOT_SELECTORS)) {
    if (location.startsWith(site)) {
      return document.querySelector(selector(location));
    }
  }

  return document.body;
}

// Get the heading elements to generate the TOC from.
function getHeadingElements(rootNode) {
  const location = document.location.href;

  for (const [site, selector] of Object.entries(HEADING_SELECTORS)) {
    if (location.startsWith(site)) {
      return [...rootNode.querySelectorAll(selector(location))];
    }
  }

  return [...rootNode.querySelectorAll(DEFAULT_HEADING_SELECTOR)];
}

// Generate the TOC from the heading elements.
function generateTOC(sendResponse) {
  const rootNode = getRootNode();
  const headingElements = getHeadingElements(rootNode);

  const ids = headingsToIds(headingElements.map(node => node.textContent.trim()));

  const data = headingElements.map((node, i) => {
    // Add the anchor ID to the node at the same time, if not already there.
    let id = node.id;
    if (!id) {
      // Try a nested node that has an id.
      const idChild = node.querySelector("[id]");
      if (idChild) {
        id = idChild.id;
      } else {
        // make one up.
        id = ids[i];
        node.id = id;
      }
    }

    return {
      level: parseInt(node.tagName.substring(1)),
      title: node.textContent.trim(),
      id
    };
  });

  sendResponse({ toc: data });
}

function jumpTo(id) {
  document.querySelector(`#${id}`).scrollIntoView();
}

function headingsToIds(headings) {
  const ids = [];
  for (let i = 0; i < headings.length; i++) {
    const text = headings[i];
    let id = text.toLowerCase();

    // Remove URLs first, otherwise we'll loose the tagging and won't be able to discern the
    // url from the text. Keep only the text part.
    id = id.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Only punctuation -, _ and . is kept, all other non letter characters are discarded.
    id = id.replace(/[^a-zA-Z0-9-_\. ]/g, '');

    // Spaces are replaced by -.
    id = id.replace(/\s+/g, '-');

    // Consecutive same character -, _ or . are rendered into a single one.
    id = id.replace(/-+/g, '-');
    id = id.replace(/_+/g, '_');
    id = id.replace(/\./g, '.');

    // -.- and -_- are replaced by . and _, respectively.
    id = id.replace(/-\.-/g, '.');
    id = id.replace(/-_-/g, '_');

    // Characters -, _ and . at the end of the string are also discarded.
    id = id.replace(/[-_\.]+$/, '');

    // Remove initial non-letter chars.
    id = id.replace(/^[^a-z]+/, '');

    // If id is empty, use 'section' instead.
    if (id === '') {
      id = 'section';
    }

    ids.push(id);
  }

  // Post process to de-duplicate ids.
  const idCounts = {};
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (idCounts[id] === undefined) {
      idCounts[id] = 0;
    } else {
      idCounts[id]++;
      ids[i] = id + '-' + idCounts[id];
    }
  }

  return ids;
}
