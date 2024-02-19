const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function processFiles(folderPath, files) {
  const browser = await puppeteer.launch({ headless: 'new' });

  try {

    const promises = files.map(async (file) => {
      const filePath = path.join(folderPath, file);
      const data = fs.readFileSync(filePath, 'utf8');
      const newFilename = await renameFile(data, browser);
      const newFilePath = path.join(folderPath, `${newFilename}.txt`);

      try {
        fs.renameSync(filePath, newFilePath);
        console.log(`${file} renamed to ${newFilename}.txt`);
      } catch (err) {
        console.error(`Error renaming ${file}: ${err}`);
      }
    });

    await Promise.all(promises);
  } finally {
    await browser.close(); // Close the browser after processing the batch
  }
}

async function renameFile(cookie) {
  const trimmedCookieText = cookie.trim();

  try {
    const cookieData = JSON.parse(trimmedCookieText);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Go to page netflix and clear all cookies;
    await page.goto('https://netflix.com/');
    const cookiePage = await page.cookies();
    await page.deleteCookie(...cookiePage);

    // Import new Cookies;
    for (const cookie of cookieData) {
      await page.setCookie(cookie);
    }
    await page.reload();
    const currentUrl = page.url();
    if (currentUrl === 'https://www.netflix.com/browse') {
      console.log("Cookies Live");
      // Get current country;
      var countryName = '';
      var emailAddress = '';

      const pageSource = await page.content();
      const match = pageSource.match(/"currentCountry":"(\w+)"/);

      if (match) {
        countryName = match[1];
      } else {
        console.log('Country name not found in the source code.')
        countryName = 'NotFound';
      }

      // Get email address
      await page.goto('https://netflix.com/youraccount');
      try {
        const email = await page.evaluate(() => {
          const divElement = document.querySelector('div[data-uia="account-email"]');
          if (!divElement) {
            throw new Error("Email address not found on the initial page");
          }
          return divElement.textContent.trim();
        });
        emailAddress = email;

      } catch (error) {
        // If email address not found, navigate to profiles page
        console.log("Navigating to https://www.netflix.com/account/security");
        await page.goto('https://www.netflix.com/account/security');

        const htmlContent = await page.content();
        // const emailAddressRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g;
        const emailAddressRegex = /(?<!\w)([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(?!\w)/g;
        const emailAddresses = htmlContent.match(emailAddressRegex);
        const firstEmailAddress = emailAddresses ? emailAddresses[0] : null;

        if (firstEmailAddress) {
          console.log('Email Address:', emailAddresses);
          emailAddress = firstEmailAddress;
        } else {
          console.log('No email addresses found on the page.');
        }
      }

      const newFilename = countryName + "-" + emailAddress;
      // console.log(newFilename);
      return newFilename;

    } else {
      console.log("DIE DIE DIE DIE");
      await browser.close();

    }

    await browser.close();

  } catch (error) {
    console.error(`Error parsing JSON: ${error.message}`);
    return 1;
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