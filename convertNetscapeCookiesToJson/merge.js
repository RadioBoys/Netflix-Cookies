const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user to input the folder path
rl.question('Enter the path of the input folder: ', (inputFolder) => {
  rl.close();

  const outputFile = './mergeFile.txt';

  // Check if mergeFile.txt already exists
  if (fs.existsSync(outputFile)) {
    console.log('mergeFile.txt already exists. Overwriting existing content.');
  } else {
    console.log('Creating mergeFile.txt.');
  }

  // Overwrite the file with new content
  fs.writeFileSync(outputFile, ''); // Clear the file

  const inputFiles = fs.readdirSync(inputFolder)
    .filter(file => fs.statSync(path.join(inputFolder, file)).isFile())
    .map(file => path.join(inputFolder, file));

  for (const inputFile of inputFiles) {
    const fileName = path.basename(inputFile);
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    fs.appendFileSync(outputFile, `=== ${fileName} ===\n${fileContent}\n`);
  }

  console.log('Combined files with file names successfully.');
});
