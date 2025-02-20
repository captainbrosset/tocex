const tocEl = document.getElementById("toc");
const copyHeadingsBtn = document.getElementById("copy-headings");
const copyLinksBtn = document.getElementById("copy-links");
// const generateBtn = document.getElementById("generate");

let currentTOC = [];

chrome.storage.session.get('toc', ({ toc }) => {
  onTocChanged(toc);
});

chrome.storage.session.onChanged.addListener((changes) => {
  if (!changes.toc || !changes.toc.newValue) {
    return;
  }

  onTocChanged(changes.toc.newValue);
});

function onTocChanged(toc) {
  if (!Array.isArray(toc)) {
    return;
  }

  currentTOC = toc;

  tocEl.innerHTML = "";

  for (const heading of toc) {
    const el = document.createElement("li");
    el.dataset.level = heading.level;
    el.dataset.indent = "\t".repeat(heading.level - 1);
    el.dataset.id = heading.id;

    const span = document.createElement("span");
    span.textContent = heading.title;
    el.appendChild(span);

    span.addEventListener("click", () => {
      chrome.storage.session.set({
        "tocexJumpId": heading.id
      });
    });

    tocEl.appendChild(el);
  }
}

// generateBtn.addEventListener("click", () => {
//   chrome.storage.session.set({
//     "tocexRegen": Date.now()
//   });
// });

copyHeadingsBtn.addEventListener("click", () => {
  const str = currentTOC.map(heading => {
    return `${"  ".repeat(heading.level - 1)}${"#".repeat(heading.level)} ${heading.title}`;
  }).join("\n");

  navigator.clipboard.writeText(str);
});

copyLinksBtn.addEventListener("click", () => {
  const str = currentTOC.map(heading => {
    return `${"  ".repeat(heading.level - 1)}* [${heading.title}](#${heading.id})`;
  }).join("\n");

  navigator.clipboard.writeText(str);
});
