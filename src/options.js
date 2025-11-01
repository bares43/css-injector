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

// Export rules to JSON file
document.getElementById('exportButton').addEventListener('click', () => {
  const ruleRows = document.querySelectorAll('.ruleRow');
  let customRules = [];
  
  ruleRows.forEach(row => {
    const name = row.querySelector('.nameInput').value.trim();
    const domain = row.querySelector('.domainInput').value.trim();
    const css = row.querySelector('.cssInput').value;
    const enabled = row.querySelector('.enabledInput').checked;
    if (domain) {
      customRules.push({ name, domain, css, enabled });
    }
  });
  
  const dataStr = JSON.stringify(customRules, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'css-injector-rules.json';
  link.click();
  
  URL.revokeObjectURL(link.href);
});

// Import rules from JSON file
document.getElementById('importButton').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedRules = JSON.parse(e.target.result);
      
      // Validate the imported data structure
      if (!Array.isArray(importedRules)) {
        throw new Error('Invalid file format: expected an array of rules');
      }
      
      // Clear existing rules
      const container = document.getElementById('customRulesContainer');
      container.innerHTML = '';
      
      // Add imported rules
      importedRules.forEach(rule => {
        if (rule.domain) {
          addRuleRow(
            rule.name || '',
            rule.domain,
            rule.css || '',
            rule.enabled !== false
          );
        }
      });
      
      alert('Rules imported successfully!');
    } catch (error) {
      alert('Error importing rules: ' + error.message);
      console.error('Import error:', error);
    }
  };
  
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
});
