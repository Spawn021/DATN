const fs = require('fs')
const scrapers = require('./scraper')
const scrapeController = async (browserInstance) => {
   const url = 'https://digital-world-2.myshopify.com/'

   try {
      let browser = await browserInstance
      const categories = await scrapers.scrapeCategory(browser, url)
      const brands = await scrapers.scrapeBrand(browser, url)

      const catePromise = []
      for (let category of categories) {
         catePromise.push(scrapers.scrapeItems(browser, category.link))
      }
      const items = await Promise.all(catePromise)

      const data = []
      for (let item of items) {
         for (let link of item) {
            data.push(scrapers.scrape(browser, link))
         }
      }
      const result = await Promise.all(data)
      fs.writeFile('data.json', JSON.stringify(result), (err) => {
         if (err) {
            console.log('Error writing file: ', err)
         }
         console.log('Successfully wrote file')
      })
      fs.writeFile('brand.json', JSON.stringify(brands), (err) => {
         if (err) {
            console.log('Error writing file: ', err)
         }
         console.log('Successfully wrote file')
      })
   } catch (err) {
      console.log('Could not resolve the browser instance => : ', err)
   }
}
module.exports = scrapeController
