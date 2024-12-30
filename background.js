// // background.js
// // Author:
// // Author URI: https://
// // Author Github URI: https://www.github.com/
// // Project Repository URI: https://github.com/
// // Description: Handles all the browser level activities (e.g. tab management, etc.)
// // License: MIT
// // Store the API key securely in the background script
// // background.js

// // Store the API key securely (you can also use chrome.storage.local for more persistence)
// const GEMINI_API_KEY = "AIzaSyA1xjO4_nPslpeJPUBYQD7ezsiOd7GF8ZU";

// // Listen for requests from content.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getAPIKey") {
//         sendResponse({ apiKey: GEMINI_API_KEY });
//     }
// });
