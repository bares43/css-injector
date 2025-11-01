# CSS Injector Browser Extension - AI Agent Instructions

## Project Overview

This is a browser extension that allows users to inject custom CSS styles into specific websites. The extension provides a simple interface for creating domain-specific CSS rules that are automatically applied when visiting matching websites.

## Architecture

- **Extension Type**: Browser extension (Manifest V2)
- **Core Files**:
  - `src/manifest.json` - Extension configuration and permissions
  - `src/background.js` - Main logic for CSS injection
  - `src/options.html` - Settings page UI
  - `src/options.js` - Settings page functionality
  - `src/icon.png` - Extension icon

## How It Works

1. Users configure CSS rules through the options page
2. Each rule contains: name, domain, CSS code, and enabled status
3. Background script monitors tab updates
4. When a page loads, it checks if any rules match the domain
5. Matching CSS is injected into the active tab

## Key Features

- Domain-based CSS rule matching
- Enable/disable individual rules
- Persistent storage of user settings
- Real-time CSS injection on page load

## Maintenance Guidelines

### Code Style
- Use modern JavaScript (ES6+)
- Keep functions small and focused
- Add error handling for all async operations
- Use descriptive variable names

### Testing Changes
- Test with multiple domains and CSS rules
- Verify settings persistence across browser restarts
- Check that disabled rules don't inject CSS
- Test error scenarios (invalid URLs, malformed CSS)

### Common Tasks
- **Adding new features**: Extend the options UI and update background logic
- **Bug fixes**: Check console logs for errors, test edge cases
- **Performance**: Minimize CSS injection overhead, optimize rule matching

### Browser Compatibility
- Currently uses Manifest V2 (consider V3 migration for future)
- Uses `browser` API (works in Firefox, Chrome with polyfill)
- Requires permissions: tabs, storage, all URLs

## Development Notes

- Settings are stored in `browser.storage.local`
- CSS injection happens on `tabs.onUpdated` with `status: "complete"`
- Domain matching uses `hostname.includes()` for flexibility
- All CSS rules for a domain are concatenated before injection