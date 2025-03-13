# WebToc - A table of contents extractor in your browser

WebToc is a browser sidebar extension that displays the detailed table of contents outline (levels h2-h6) for all webpages, in the sidebar as you surf the web. Useful for page structure analysis and comparing webpages.

* You can copy the TOC as a Markdown headings outline.  The **Copy as headings** button creates a nested list of headings in Markdown, which you can use for general-purpose doc-design, such as comparing docs and re-outlining.

* You can copy as Markdown links and then paste a “Detailed contents” section at the top of an article.  The **Copy as links** button creates a local TOC, in Markdown, to add at the top of a webpage/ article.

![Image](https://github.com/user-attachments/assets/a8bb8a1f-582e-4563-9335-b09999c22c6e)

WebToc generates a table of contents from the h1 to h6 tags in the current page, and displays it in the sidebar. It is useful for reviewing the content of long articles and documentation and quickly jumping around within a webpage.

To use this tool to compare two pages in realtime, open the pages in two different browsers, such as Edge Stable and Edge Canary; see [Become a Microsoft Edge Insider](https://aka.ms/microsoftedge).  You can open two different browsers (such as Edge Stable, Edge Canary, or Chrome) side-by-side, and independently **Refresh** each browser.

This tool has been tested in Microsoft Edge and in Chrome.


#### Website-specific behavior

For the following websites, WebToc omits the extra headings at top & bottom of the webpage:
* learn.microsoft.com
   * https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/evaluate-performance/reference
* review.learn.microsoft.com
   * https://review.learn.microsoft.com/microsoft-edge/devtools-guide-chromium/performance/reference?branch=pr-en-us-3378
* github.com - GitHub Markdown preview
   * https://github.com/MicrosoftDocs/edge-developer/blob/user/mikehoffms/perf-sync/microsoft-edge/devtools-guide-chromium/performance/performance-tool-overview.md
* developer.chrome.com - Chrome docs
   * https://developer.chrome.com/docs/devtools/performance/reference


#### Install and use the tool

**To install and use WebToc:**

1. Clone or download this repo.  Example path:
   C:\Users\localAccount\GitHub\
   The result will then be:
   C:\Users\localAccount\GitHub\WebToc\
 
1. In Microsoft Edge or Chrome, click **Settings and more** or **Customize and control** in the upper right, click **Extensions**, and then click **Manage extensions**.

   The **Extensions** tab opens.

1. Turn on the **Developer mode** toggle on the left or in the upper right. 

1. Click the **Load unpacked** button.

   The "Select the extension directory" dialog opens.

1. Navigate to your clone of the repo, such as:
   C:\Users\localAccount\GitHub\WebToc\

1. Click the **Select Folder** button.

   The extension is listed.

1. To the right of the Address bar, click the **Extensions** button, and then next to **Table of contents**, click the **Pin** button.  

1. Click the **Table of contents** sidebar button.

1. Go to a webpage.  

1. Refresh the webpage (F5).

   The TOC is displayed in the sidebar of the browser.

1. Click the **Copy as headings** button, and then paste into an editor, such as Visual Studio Code.

1. Click the **Copy as links** button, and then paste into a .md file in an editor, such as Visual Studio Code.

See also:
* [Everything to know about browser extensions](https://www.microsoft.com/edge/learning-center/everything-to-know-about-browser-extensions?form=MA13I2&msockid=3078d2dac55660f53e4ec6a8c4ec61bf) - introduction for users.
* [Add, turn off, or remove extensions in Microsoft Edge](https://support.microsoft.com/microsoft-edge/add-turn-off-or-remove-extensions-in-microsoft-edge-9c0ec68c-2fbc-2f2c-9ff0-bdc76f46b026) - support steps for users.
* [Sideload an extension to install and test it locally](https://learn.microsoft.com/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)
