const fs = require('fs');
const path = require('path');

// Define the folder names
const mainFolderName = "B0t's Password Manager";
const passwordsFolderName = "passwords";

// Get the AppData (Roaming) directory path
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local');

// Construct the full paths
const mainFolderPath = path.join(appDataPath, mainFolderName);
const passwordsFolderPath = path.join(mainFolderPath, passwordsFolderName);

// Fetch and display the stored passwords
function displayStoredPasswords() {
  // Get the password list element
  const passwordList = document.getElementById('passwordList');

  // Clear the existing password list
  passwordList.innerHTML = '';

  // Read the contents of the passwords folder
  fs.readdir(passwordsFolderPath, (err, files) => {
    if (err) {
      console.error('Failed to read the passwords folder:', err);
      return;
    }

    // Check if any passwords are stored
    if (files.length === 0) {
      const noPasswordsItem = document.createElement('li');
      noPasswordsItem.classList.add('no-passwords');
      noPasswordsItem.textContent = 'No passwords stored.';
      passwordList.appendChild(noPasswordsItem);
    } else {
      // Iterate over the files and add each one as a list item
      files.forEach(file => {
        const siteName = path.basename(file, path.extname(file));
        const passwordFilePath = path.join(passwordsFolderPath, file);
        fs.readFile(passwordFilePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Failed to read the password file (${file}):`, err);
            return;
          }

          const passwordItem = document.createElement('li');
          passwordItem.classList.add('password-item');
          passwordItem.textContent = siteName;
          passwordList.appendChild(passwordItem);
        });
      });
    }
  });
}

// Call the function to display the stored passwords on page load
displayStoredPasswords();
