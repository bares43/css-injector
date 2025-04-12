// background.js

// Helper function to extract the hostname from a URL.
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    console.error("Error parsing URL:", e);
    return "";
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ensure that the page is completely loaded and the URL is valid.
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith('http')) {
    browser.storage.local.get({
      customRules: []
    }).then((settings) => {
      let cssToInject = '';  // Start with an empty string

      // Get the hostname of the current tab.
      const hostname = getHostname(tab.url).toLowerCase();

      // Iterate over each custom rule.
      settings.customRules.forEach(rule => {
        // Only apply the rule if enabled and if the rule's domain is found in the hostname.
        if (rule.enabled && hostname.includes(rule.domain.toLowerCase())) {
          cssToInject += '\n' + rule.css;
        }
      });

      // Only inject CSS if there is any content to inject.
      if (cssToInject.trim()) {
        browser.tabs.insertCSS(tabId, {
          code: cssToInject
        })
        .then(() => {
          console.log('Custom CSS injected on tab', tabId);
        })
        .catch((err) => {
          console.error('Failed to inject CSS:', err);
        });
      }
    }).catch((error) => {
      console.error('Error retrieving settings:', error);
    });
  }
});
