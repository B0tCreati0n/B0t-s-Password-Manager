const fs = require('fs');
const path = require('path');
const process = require('process');
const forge = require('node-forge');

// Define the folder names
const mainFolderName = "B0t's Password Manager";
const ivFolderName = "IV";
const passwordsFolderName = "passwords";

// Get the AppData (Roaming) directory path
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local');

// Construct the full paths
const mainFolderPath = path.join(appDataPath, mainFolderName);
const ivFolderPath = path.join(mainFolderPath, ivFolderName);
const passwordsFolderPath = path.join(mainFolderPath, passwordsFolderName);

// Check if the main folder exists, restart the program if not
if (!fs.existsSync(mainFolderPath)) {
  console.log(`Main folder '${mainFolderName}' does not exist.`);
  process.exit(1);
}

// Check if the IV folder exists, restart the program if not
if (!fs.existsSync(ivFolderPath)) {
  console.log(`IV folder '${ivFolderName}' does not exist.`);
  process.exit(1);
}

// Check if the passwords folder exists, restart the program if not
if (!fs.existsSync(passwordsFolderPath)) {
  console.log(`Passwords folder '${passwordsFolderName}' does not exist.`);
  process.exit(1);
}

try {
  // Retrieve the name, username, password, and master password to encrypt from command-line arguments
  const input = process.argv[2];
  const masterPassword = process.argv[3];

  if (!input || typeof input !== 'string' || !input.startsWith('Name:') || !input.includes('Username:') || !input.includes('Password:')) {
    throw new Error('Invalid input format. Expected "Name:<NAME> Username:<USERNAME> Password:<PASSWORD>".');
  }

  const nameIndex = input.indexOf('Name:');
  const usernameIndex = input.indexOf('Username:');
  const passwordIndex = input.indexOf('Password:');

  const name = input.substring(nameIndex + 5, usernameIndex).trim();
  const username = input.substring(usernameIndex + 9, passwordIndex).trim();
  const passwordToEncrypt = input.substring(passwordIndex + 9).trim();

  // Generate a random Initialization Vector (IV)
  const iv = forge.random.getBytesSync(16);

  // Create a cipher using AES-CBC algorithm
  const cipher = forge.cipher.createCipher('AES-CBC', masterPassword);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(passwordToEncrypt));
  cipher.finish();
  const encryptedPassword = cipher.output.getBytes();

  // Get the filename based on the IV
  const ivFilename = `${name}.txt`;
  const passwordFilename = `${name}.txt`;

  // Store the IV in the "IV" folder
  const ivFilePath = path.join(ivFolderPath, ivFilename);
  fs.writeFileSync(ivFilePath, forge.util.bytesToHex(iv));
  console.log(`IV stored in ${ivFilePath}`);

  // Store the encrypted password in the "passwords" folder
  const passwordFilePath = path.join(passwordsFolderPath, passwordFilename);
  fs.writeFileSync(passwordFilePath, `Username: ${username} Password: ${forge.util.bytesToHex(encryptedPassword)}`);
  console.log(`Encrypted password stored in ${passwordFilePath}`);

  process.exit(0); // Exit with code 0 indicating success
} catch (error) {
  console.error(`Encryption process encountered an error:`, error);
  process.exit(1); // Exit with code 1 indicating failure
}
