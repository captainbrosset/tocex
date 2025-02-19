const tagNames = ["H1", "H2", "H3", "H4", "H5", "H6"];

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "generate-toc") {
    generateTOC(sendResponse);
  } else if (msg.action === "jump-to") {
    jumpTo(msg.id);
  }
});

function generateTOC(sendResponse) {
  const data = [...document.querySelectorAll("*")].filter(node => {
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
