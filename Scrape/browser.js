const puppeteer = require('puppeteer')
const startBrowser = async () => {
   let browser
   try {
      console.log('Opening the browser......')
      browser = await puppeteer.launch({
         headless: true, // by default it is true, so the browser will not open. But we are setting it to false so that we can see the browser in action
         args: ['--disable-setuid-sandbox'], // turn off the sandbox mode when running in root (used for avoiding access issues)
         ignoreHTTPSErrors: true, // ignore https errors
      })
   } catch (err) {
      console.log('Could not create a browser instance => : ', err)
   }
   return browser
}
module.exports = startBrowser
