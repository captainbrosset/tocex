// The headings to look for.
const tagNames = ["H1", "H2", "H3", "H4", "H5", "H6"];

// The root element to start looking for headings.
// This depends on websites. If a website is missing from this list,
// the default root element is document.body.
const rootSelectors = {
  "https://learn.microsoft.com/": () => ".content",
  "https://developer.chrome.com/docs/": () => "main",
  "https://github.com/": url => {
    if (url.endsWith(".md") || url.includes(".md#")) {
      return "article";
    }
    return "body";
  }
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "generate-toc") {
    generateTOC(sendResponse);
  } else if (msg.action === "jump-to") {
    jumpTo(msg.id);
  }
});

function getRootNode() {
  const location = document.location.href;

  for (const [site, selector] of Object.entries(rootSelectors)) {
    if (location.startsWith(site)) {
      return document.querySelector(selector(location));
    }
  }

  return document.body;
}

function generateTOC(sendResponse) {
  const data = [...getRootNode().querySelectorAll("*")].filter(node => {
    return tagNames.includes(node.tagName);
  }).map(node => {
    // Add a jump ID to the node at the same time.
    let id = node.id;
    if (!id) {
      // Try a nested node that has an id.
      const idChild = node.querySelector("[id]");
      if (idChild) {
        id = idChild.id;
      } else {
        // make one up.
        id = `tocex-id-${window.crypto.randomUUID()}`;
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
