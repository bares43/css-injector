// popup.js

document.addEventListener('DOMContentLoaded', () => {
  // Open settings page when clicking the settings menu item
  document.getElementById('openSettings').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
    window.close();
  });
});