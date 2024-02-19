const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getRandomFiles(folderPath, count) {
  const files = fs.readdirSync(folderPath);
  const randomFiles = [];

  while (randomFiles.length < count && files.length > 0) {
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files.splice(randomIndex, 1)[0];
    randomFiles.push(randomFile);
  }

  return randomFiles;
}

function moveFilesToRandomFolder(folderPath, randomFiles) {
  const randomFolderPath = path.join(folderPath, 'RandomFiles');
  if (!fs.existsSync(randomFolderPath)) {
    fs.mkdirSync(randomFolderPath);
  }

  randomFiles.forEach((file) => {
    const sourcePath = path.join(folderPath, file);
    const destinationPath = path.join(randomFolderPath, file);

    fs.renameSync(sourcePath, destinationPath);
    console.log(`${file} moved to ${randomFolderPath}`);
  });
}

rl.question('Enter folder path to pick Random: ', (folderPath) => {
  rl.question('Enter the number of random files to select: ', (numOfRandomFiles) => {
    try {
      const selectedFiles = getRandomFiles(folderPath, parseInt(numOfRandomFiles));
      console.log('Randomly selected files:', selectedFiles);

      moveFilesToRandomFolder(folderPath, selectedFiles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      rl.close();
    }
  });
});

rl.on('close', () => {
  console.log('Exiting program.');
  process.exit(0);
});
