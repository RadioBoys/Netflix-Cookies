# Cookies Netflix
## Using Puppeteer to run

## Installation

These examples run on Node.js. On its
[website](http://www.nodejs.org/download/) you can find instructions on how to
install it.

Once installed, clone the repository and install its dependencies running:

```bash
npm install
```
Install package [Puppeteer](https://www.npmjs.com/package/puppeteer). You can read document before install it.
```bash
npm i puppeteer
```

You can install [Selenium Webdriver](https://www.npmjs.com/package/selenium-webdriver) if you use file `crackPINUserLock.js`.
Crack must to go to site [Netflix](https://www.netflix.com/) and pick user lock with HTML Element (You can change this when pick another user lock).
```bash
npm i selenium-webdriver
```

## Running the project
## The config file run with JSON Cookies. If your file is NETSCAPE Cookies you must convert it to JSON.
1. Use my project
Run file `index.html` to convert NETSCAPE Cookies to JSON Cookies. This file can convert many file NETSCAPE to JSON.
OR
2. Use convert online [Here](https://leaksradar.com/converter)

## Merge file (If you need to convert many many file NETSCAPE Cookies to JSON Cookies).
This script to merge all files Netscape to one file name `mergeFile.txt` when run. Copy all data from `mergeFile.txt` and paste it on local `index.html`.
Finally, click Convert and scroll down you can see button "Download all JSON" and download it.

```bash
node merge.js
```
## Run config
Open folder or terminal to ./config and run `node [NAME FILE YOU WANT TO RUN]` and enjoy.

```bash
node [NAME FILE YOU WANT TO RUN]
```

## Thanks for reading!!
