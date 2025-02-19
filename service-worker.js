// Open the sidebar when the extension action button is clicked.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onActivated.addListener(function (activeTab) {
  generateTOC(activeTab.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  generateTOC(tabId);
});

function generateTOC(tabId) {
  // Send a message to the background script.
  chrome.tabs.sendMessage(
    tabId,
    {
      action: "generate-toc"
    },
    function (response) {
      if (!response || !response.toc) {
        return;
      }

      // When the response is back, save it the session storage.
      chrome.storage.session.set(response);
    }
  );
}

chrome.storage.session.onChanged.addListener(async (changes) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab) {
    return;
  }

  if (changes.tocexJumpId) {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "jump-to",
        id: changes.tocexJumpId.newValue
      }
    );
  }

  if (changes.tocexRegen) {
    generateTOC(tab.id);
  }
});
