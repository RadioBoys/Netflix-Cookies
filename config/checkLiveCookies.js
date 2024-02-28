const fs = require('fs'); // Import the 'fs' module for file operations
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const path = require('path');
const readline = require('readline');


const targetUrl = 'https://www.netflix.com';
// Create a new CookieJar instance
const cookieJar = new CookieJar();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter folder path: ', async (inputFolder) => {
    rl.close();

    const inputFiles = fs.readdirSync(inputFolder)
        .filter(file => fs.statSync(path.join(inputFolder, file)).isFile())
        .map(file => path.join(inputFolder, file));

    const batchSize = 5;
    let batchStart = 0;

    while (batchStart < inputFiles.length) {
        const currentBatch = inputFiles.slice(batchStart, batchStart + batchSize);
        await processFiles(currentBatch);
        batchStart += batchSize;
    }
});

// Function to import cookies from a file and make a request to the site
async function importCookiesFromFileAndMakeRequest(url, cookieText) {
    try {
        // Parse the cookie string into an array of objects
        const parsedCookies = JSON.parse(cookieText);

        // Set the cookies in the cookie jar
        parsedCookies.forEach(cookie => {
            cookieJar.setCookieSync(`${cookie.name}=${cookie.value}`, url);
        });

        // Make a GET request to the URL with the cookies
        const response = await axios.get(url, {
            // Manually set the 'Cookie' header using the cookie jar
            headers: {
                Cookie: cookieJar.getCookieStringSync(url)
            }
        })

        // Check if "membershipStatus" is "CURRENT_MEMBER" in the response data
        if (response.data.includes('"membershipStatus":"CURRENT_MEMBER"')) {
            return 0;
        } else {
            return 1;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return 1;
    }
}

async function processFiles(inputFiles) {
    const promises = inputFiles.map(async (inputFile) => {
        const fileContent = fs.readFileSync(inputFile, 'utf-8');
        const fileName = path.basename(inputFile);
        const check = await importCookiesFromFileAndMakeRequest(targetUrl, fileContent);

        if (check === 1) {
            console.log(`❌ ${fileName}`);
            fs.unlinkSync(inputFile);
        } else {
            console.log(`✅ ${fileName}`);
        }
    });

    await Promise.all(promises);
}
