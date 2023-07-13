const fs = require('fs');
const path = require('path');

// Get the AppData (Roaming) directory path
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local');

// Define the folder name
const folderName = "B0t's Password Manager";

// Construct the full folder path
const folderPath = path.join(appDataPath, folderName);

// Define the child folder names
const childFolderNames = ["passwords", "IV"];

// Check if the main folder exists
if (!fs.existsSync(folderPath)) {
  try {
    // Create the main folder if it doesn't exist
    fs.mkdirSync(folderPath);
    console.log(`Folder '${folderName}' created successfully.`);
  } catch (error) {
    console.error(`Error creating folder '${folderName}':`, error);
  }
} else {
  console.log(`Folder '${folderName}' already exists.`);
}

// Create the child folders if they don't exist
childFolderNames.forEach((childFolderName) => {
  const childFolderPath = path.join(folderPath, childFolderName);
  if (!fs.existsSync(childFolderPath)) {
    try {
      fs.mkdirSync(childFolderPath);
      console.log(`Child folder '${childFolderName}' created successfully.`);
    } catch (error) {
      console.error(`Error creating child folder '${childFolderName}':`, error);
    }
  } else {
    console.log(`Child folder '${childFolderName}' already exists.`);
  }
});
