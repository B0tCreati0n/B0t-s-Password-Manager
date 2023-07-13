const { spawn } = require('child_process');

// Specify the path to the startup script
const startupScriptPath = './startup.js';

// Spawn a new process to run the startup script
const startupProcess = spawn('node', [startupScriptPath]);

// Handle the process events
startupProcess.on('error', (error) => {
  console.error(`Failed to start the script: ${error.message}`);
});

startupProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('The script exited successfully.');
    // Proceed with the rest of the program here
  } else {
    console.error(`The script exited with code ${code}.`);
  }
});

const passwordToEncrypt = "MyP4ssw0rd123!"; // Replace with the password you want to encrypt
const username = "exampleUser"; // Replace with the username
const name = "exampleName"; // Replace with the name
const masterPassword = "MyM4sterP4ssw0rd123!"; // Replace with the master password

const encryptProcess = spawn('node', [
  'encrypt.js',
  `Name:${name} Username:${username} Password:${passwordToEncrypt}`,
  masterPassword,
]);

encryptProcess.on('error', (error) => {
  console.error(`Failed to start the encryption process: ${error.message}`);
});

encryptProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('Encryption process completed successfully.');
  } else {
    console.error(`Encryption process exited with code ${code}.`);
    process.exit(code); // Exit with the same code as the child process
  }
});
