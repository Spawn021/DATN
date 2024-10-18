const scrapeCategory = async (browser, url) =>
   new Promise(async (resolve, reject) => {
      try {
         let page = await browser.newPage()
         console.log('>> Open new tab ...')
         await page.goto(url)
         console.log('>> Go to URL ...' + url)
         await page.waitForSelector('#shopify-section-all-collections')
         console.log('>> Web has finished loading ... ')

         const dataCategory = await page.$$eval(
            '#shopify-section-all-collections > div.all-collections > div.sdcollections-content > ul.sdcollections-list > li',
            (els) => {
               dataCategory = els.map((el) => {
                  return {
                     category: el.querySelector('div.collection-name').innerText,
                     link: el.querySelector('a').href,
                  }
               })
               return dataCategory
            },
         )
         console.log('>> Get data category ...')
         await page.close()
         console.log('>> Close tab ...')

         resolve(dataCategory)
      } catch (err) {
         console.log('Could not resolve the browser instance => : ', err)
         reject(err)
      }
   })
const scrapeBrand = async (browser, url) =>
   new Promise(async (resolve, reject) => {
      try {
         let page = await browser.newPage()
         console.log('>> Open new tab ...')
         await page.goto(url)
         console.log('>> Go to URL ...' + url)
         await page.waitForSelector('#shopify-section-1492526858634')
         console.log('>> Web has finished loading ... ')

         const dataBrand = await page.$$eval(
            '#shopify-section-1492526858634 > div.wrapper > div.brands-slider > div.hotcoll_group > div',
            (els) => {
               dataBrand = els.map((el) => {
                  const brands = el.querySelectorAll('div.hot-inner div.hot-links > ul > li.list-unstyled > a')
                  const values = []
                  for (let brand of brands) {
                     values.push(brand.innerText)
                  }
                  return {
                     cate: el.querySelector('div.hot-title').innerText,
                     brand: values,
                     img: el.querySelector('div.hot-inner > div.hot-image > img')?.src,
                  }
               })
               return dataBrand
            },
         )
         console.log('>> Get data brand ...')
         await page.close()
         console.log('>> Close tab ...')

         resolve(dataBrand)
      } catch (err) {
         console.log('Could not resolve the browser instance => : ', err)
         reject(err)
      }
   })
const scrapeItems = async (browser, url) =>
   new Promise(async (resolve, reject) => {
      try {
         let page = await browser.newPage()
         console.log('>> Open new tab ...')
         await page.goto(url)
         console.log('>> Go to URL ' + url)
         await page.waitForSelector('#collection_content')
         console.log('>> Web has finished loading')

         const items = await page.$$eval('#collection-product-grid > div.grid-element', (els) => {
            items = els.map((el) => el.querySelector('a.grid-view-item__link').href)
            return items
         })
         await page.close()
         console.log('>> Close tab ...')

         resolve(items)
      } catch (err) {
         console.log('Could not resolve the browser instance => : ', err)
         reject(err)
      }
   })
const scrape = (browser, url) =>
   new Promise(async (resolve, reject) => {
      try {
         let page = await browser.newPage()
         console.log('>> Open new tab ...')
         await page.goto(url)
         console.log('>> Go to URL ' + url)
         await page.waitForSelector('#PageContainer')
         console.log('>> Web has finished loading')

         const scrapedData = {}
         // Get category
         const category = await page.$$eval('nav.breadcrumb > a', (els) => {
            category = els.map((el) => {
               return el.innerText
            })
            return category
         })
         scrapedData.category = category
         //Get name product
         const name = await page.$eval('header.section-header', (el) => {
            return el.querySelector('h3')?.innerText
         })
         scrapedData.name = name
         scrapedData.brand = name?.split(' ')[0]
         // Get thumbnail
         const thumbnail = await page.$eval('#ProductPhoto', (el) => {
            return el.querySelector('#ProductPhotoImg')?.src
         })
         scrapedData.thumbnail = thumbnail
         // Get images
         const images = await page.$$eval('#ProductThumbs > div.owl-wrapper-outer > div.owl-wrapper > div.owl-item', (els) => {
            images = els.map((el) => {
               return el.querySelector('a.product-single__thumbnail')?.href
            })
            return images
         })
         scrapedData.images = images
         // Get price
         const price = await page.$eval('#ProductPrice', (el) => {
            return el.querySelector('span.money')?.innerText
         })
         scrapedData.price = price
         // Get description
         const description = await page.$$eval('div.product-single__description > ul.spec > li', (els) => {
            description = els.map((el) => {
               return el?.innerText
            })
            return description
         })
         scrapedData.description = description
         // Get variants
         const variants = await page.$$eval('form.product-single__form > div.product-form__item', (els) => {
            variants = els.map((el) => {
               const variantLabels = el.querySelectorAll('fieldset.single-option-radio > label')
               const values = []
               for (let variant of variantLabels) {
                  values.push(variant.innerText)
               }
               return {
                  label: el.querySelector('label.single-option-radio__label')?.innerText,
                  variants: values,
               }
            })
            return variants
         })
         scrapedData.variants = variants
         // Get information
         const informationTitle = await page.$$eval('#tabs-information > ul > li', (els) => {
            informationTitle = els.map((el) => {
               return el.querySelector('a').innerText
            })
            return informationTitle
         })
         const desc = await page.$eval('#desc', (el) => {
            const specs = el.querySelectorAll('ul.spec > li')
            const tempSpec = []
            for (let spec of specs) {
               tempSpec.push(spec.innerText)
            }
            const descs = el.querySelectorAll('div.desc > p')
            const tempDesc = []
            for (let desc of descs) {
               tempDesc.push(desc.innerText)
            }
            return {
               specs: tempSpec,
               desc: tempDesc,
            }
         })
         const size = await page.$eval('#size', (el) => {
            const h2 = el.querySelector('h2').innerText
            const s = el.querySelectorAll('p')
            const tempDesc = []
            for (let i of s) {
               tempDesc.push(i.innerText)
            }
            return [h2, tempDesc]
         })
         const delivery = await page.$eval('#delivery', (el) => {
            return el?.innerText
         })
         const payment = await page.$eval('#payment', (el) => {
            return el?.innerText
         })
         scrapedData.informations = {
            [informationTitle[0]]: desc,
            [informationTitle[1]]: size,
            [informationTitle[2]]: delivery,
            [informationTitle[3]]: payment,
         }

         await page.close()
         console.log('>> Close tab ...')
         resolve(scrapedData)
      } catch (err) {
         console.log('Could not resolve the browser instance => : ', err)
         reject(err)
      }
   })
module.exports = { scrapeCategory, scrape, scrapeItems, scrapeBrand }
