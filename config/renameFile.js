const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const readline = require('readline');

const targetUrl = 'https://www.netflix.com/youraccount';

// Create a new CookieJar instance
const cookieJar = new CookieJar();
var emailAddress = "";
var currentCountry = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function processFiles(folderPath, files) {
    try {

        const promises = files.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            const newFilename = await importCookiesAndMakeRequest(targetUrl, data);
            const newFilePath = path.join(folderPath, `${newFilename}.txt`);

            try {
                fs.renameSync(filePath, newFilePath);
                console.log(`${file} renamed to ${newFilename}.txt`);
            } catch (err) {
                console.error(`Error renaming ${file}: ${err}`);
            }
        });

        await Promise.all(promises);
    } catch (err)  {
        console.log(err);
    }
}

// Function to import cookies and make a request to the site
async function importCookiesAndMakeRequest(url, cookies) {
    try {
        // Parse the cookie string into an array of objects
        const parsedCookies = JSON.parse(cookies);

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
        });

        // Get email address;
        const emailAddressRegex = /(?<!\w)([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(?!\w)/g;
        const emails = response.data.match(emailAddressRegex);
        const firstEmailAddress = emails ? emails[0] : null;

        if (firstEmailAddress) {
            // console.log('Email Address:', emails);
            emailAddress = firstEmailAddress;
        } else {
            console.log('No email addresses found on the page.');
        }

        // Get current country;
        const matchCountry = response.data.match(/"currentCountry":"(\w+)"/);

        if (matchCountry) {
            currentCountry = matchCountry[1];
        } else {
            console.log('Country name not found in the source code.')
            currentCountry = 'NotFound';
        }

        const fileName = currentCountry + "-" + emailAddress;
        return fileName

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function runBatches(folderPath, batchSize, delayBetweenBatches) {
    try {
        const files = fs.readdirSync(folderPath);

        while (files.length > 0) {
            const batch = files.splice(0, batchSize);
            await processFiles(folderPath, batch);

            if (files.length > 0) {
                console.log(`Waiting for ${delayBetweenBatches / 1000} seconds before processing the next batch...`);
                await delay(delayBetweenBatches);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

rl.question('Enter folder path: ', async (folderPath) => {
    await runBatches(folderPath, 5, 10000); // 5 files per batch, 10-second delay between batches
    rl.close();
});

rl.on('close', () => {
    console.log('Exiting program.');
    process.exit(0);
});