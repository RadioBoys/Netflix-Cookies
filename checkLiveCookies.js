const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

async function checkCookies(cookieText) {
    const trimmedCookieText = cookieText.trim();

    try {
        const cookieData = JSON.parse(trimmedCookieText);

        const browser = await puppeteer.launch({ headless: 'new' }); // Specify headless mode
        const page = await browser.newPage();

        await page.goto('https://www.netflix.com/');
        const cookies = await page.cookies();
        await page.deleteCookie(...cookies);

        for (const cookie of cookieData) {
            await page.setCookie(cookie);
        }
        await page.reload();

        const currentUrl = page.url();
        const checkLive = currentUrl === 'https://www.netflix.com/browse';

        await browser.close();

        return checkLive ? 0 : 1;
    } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        return 1;
    }
}

async function processFiles(inputFiles) {
    const promises = inputFiles.map(async (inputFile) => {
        const fileContent = fs.readFileSync(inputFile, 'utf-8');
        const fileName = path.basename(inputFile);
        const check = await checkCookies(fileContent);

        if (check === 1) {
            console.log(`❌ ${fileName}`);
            fs.unlinkSync(inputFile);
        } else {
            console.log(`✅ ${fileName}`);
        }
    });

    await Promise.all(promises);
}
