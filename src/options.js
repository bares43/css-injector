// options.js

/**
 * Adds a new rule row to the options page.
 * @param {string} name - The name of the rule.
 * @param {string} domain - The domain for which the CSS applies.
 * @param {string} css - The custom CSS code.
 * @param {boolean} enabled - Whether the rule is active.
 */
function addRuleRow(name = '', domain = '', css = '', enabled = true) {
  const container = document.getElementById('customRulesContainer');
  const row = document.createElement('div');
  row.className = 'ruleRow';

  // Name input field
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name:';
  row.appendChild(nameLabel);
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'nameInput';
  nameInput.placeholder = 'Rule name';
  nameInput.value = name;
  row.appendChild(nameInput);

  // Domain input field
  const domainLabel = document.createElement('label');
  domainLabel.textContent = 'Domain:';
  row.appendChild(domainLabel);
  
  const domainInput = document.createElement('input');
  domainInput.type = 'text';
  domainInput.className = 'domainInput';
  domainInput.placeholder = 'example.com';
  domainInput.value = domain;
  row.appendChild(domainInput);

  // CSS textarea field
  const cssLabel = document.createElement('label');
  cssLabel.textContent = 'Custom CSS:';
  row.appendChild(cssLabel);
  
  const cssInput = document.createElement('textarea');
  cssInput.className = 'cssInput';
  cssInput.rows = 4;
  cssInput.placeholder = 'Enter CSS for this domain';
  cssInput.value = css;
  row.appendChild(cssInput);

  // Enabled checkbox and label
  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkboxContainer';
  
  const enabledCheckbox = document.createElement('input');
  enabledCheckbox.type = 'checkbox';
  enabledCheckbox.className = 'enabledInput';
  enabledCheckbox.checked = enabled;
  checkboxContainer.appendChild(enabledCheckbox);
  
  const enabledLabel = document.createElement('label');
  enabledLabel.textContent = 'Enabled';
  checkboxContainer.appendChild(enabledLabel);
  
  row.appendChild(checkboxContainer);
  
  // Delete button for the rule
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete Rule';
  deleteButton.addEventListener('click', () => {
    container.removeChild(row);
  });
  row.appendChild(deleteButton);
  
  container.appendChild(row);
}

// When the options page is loaded, retrieve saved custom rules and populate the form.
document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get({
    customRules: []  // Array of objects: {name, domain, css, enabled}
  }).then((items) => {
    items.customRules.forEach(rule => {
      addRuleRow(rule.name, rule.domain, rule.css, rule.enabled);
    });
  }).catch((error) => {
    console.error('Error loading settings:', error);
  });
});

// Add a new empty rule row when the "Add Rule" button is clicked.
document.getElementById('addRuleButton').addEventListener('click', () => {
  addRuleRow('', '', '', true);
});

// Save settings when the "Save Settings" button is clicked.
document.getElementById('saveButton').addEventListener('click', () => {
  const ruleRows = document.querySelectorAll('.ruleRow');
  let customRules = [];
  
  ruleRows.forEach(row => {
    const name = row.querySelector('.nameInput').value.trim();
    const domain = row.querySelector('.domainInput').value.trim();
    const css = row.querySelector('.cssInput').value;
    const enabled = row.querySelector('.enabledInput').checked;
    // Only save a rule if a domain is specified.
    if (domain) {
      customRules.push({ name, domain, css, enabled });
    }
  });
  
  browser.storage.local.set({ customRules }).then(() => {
    alert('Settings saved successfully!');
  }).catch((error) => {
    console.error('Error saving settings:', error);
  });
});
