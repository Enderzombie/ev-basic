const package = require('puppeteer');
const config = require('../../../config.json');
const fs = require('fs');

const puppeteer = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        browser: package.Browser,
        pages: Array
    },
    // Öffnet einen Puppeteer Browser gemäß den Optionen.
    async openBrowser() {
        const options = this.getOptions();

        this.data.browser = await package.launch(options);
        this.data.pages = [];
    },
    // Schließt den geöffneten Browser.
    async closeBrowser() {
        await this.data.browser.close();
    },
    // Extrahiert die Optionen, indem Einstellungsmöglichkeiten aus der config.json überprüft werden.
    getOptions() {
        if (config.puppeteer.browser.options.preset == 'Windows') {
            return {
                headless: config.puppeteer.browser.headless,
                'ignoreHTTPSErrors': true,
            }
        } else if (config.puppeteer.browser.options.preset == 'Linux') {
            return {
                headless: config.puppeteer.browser.headless,
                'ignoreHTTPSErrors': true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: config.puppeteer.browser.options.chromePath
            }
        }
    },
    // Öffnet eine neue Seite im Browser.
    async openPage(websiteUrl) {
        this.data.pages.push(await this.data.browser.newPage());
        
        page = this.data.pages[this.data.pages.length-1]; 

        // Setzt ein paar Header, welche dafür sorgen, dass puppeteer für Webseiten "menschlicher" wirkt.
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

        // Verändert die Seite anhandv on Konfigurationen.
        await page.setDefaultNavigationTimeout(config.puppeteer.page.navigationTimeout);
        await page.setViewport({ width: config.puppeteer.page.viewport.width, height: config.puppeteer.page.viewport.height });

        // Öffnet schließlich die Seite und wartet, bis diese vollständig geladen ist.
        await this.data.pages[this.data.pages.length-1].goto(websiteUrl, {
            waitUntil: 'networkidle2',
        });
    },
    // Schließt eine übergebene Seite.
    async closePage(page) {
        page ? page : page = this.lastPage();
        await page.close();
    },
    // Lädt die übergebene Seite als HTML-Datei runter.
    async downloadPage(filePath, page) {
        page ? page : page = this.lastPage();

        const content = await page.content();
        fs.writeFileSync(filePath, content);
        
        return content;
    },
    // Speichert einen Screenshot von der übergebenen Seite.
    async screenshotPage(filePath, page) {
        page ? page : page = this.lastPage();

        await page.screenshot({ path: filePath });
    },
    // Akzeptiert die Cookies auf einer übergebenen Seite anhand von einem Query-Selektor.
    async acceptCookies(websiteUrl, selector) {
        await this.openPage(websiteUrl);

        await this.click(this.lastPage(), selector);
        
        await this.closePage(this.lastPage());
    },
    // Gibt die letzte Seite aus den aktuell geöffneten Seiten zurück.
    lastPage() {
        return this.data.pages[this.data.pages.length-1];
    },
    // Wartet auf den Query-Selektor;
    async waitSelector(selector, page) {
        await page.waitForSelector(selector);
    },
    // Klickt auf einer übergebenen Seite auf einen Element mit einem übergebenen Query-Selektor.
    async click(selector, page) {
        page ? page : page = this.lastPage();
        await this.waitSelector(selector, page);

        await page.click(selector);
    },
    // Extrahiert das Favicon der übergebenen Seite. 
    async getFaviconUrl(page) {
        const faviconElement = await page.$('link[rel="icon"]');
        const faviconUrl = await faviconElement.evaluate(link => link.href);
        
        return faviconUrl;
    },
    // Durchsucht die Webseite nach Elementen mit einer bestimmten CSS-Klasse und gibt diese zurück.
    async getElementsByClass(className, page) {
        page ? page : page = this.lastPage();

        const elements = await page.evaluate((className) => {
            const elementsList = document.querySelectorAll(className);

            return Array.from(elementsList).map(element => {
                return {
                    tagName: element.tagName,
                    innerHTML: element.innerHTML,
                    outerHTML: element.outerHTML,
                    href: element.href || null // Füge href hinzu, falls ein Link vorhanden ist.
                };
            });
        }, className);
        
        return elements;
    },
    // Extrahiert die hrefs aller gefundenen Elemente des Selektors.
    async getUrls(selector, page) {
        page ? page : page = this.lastPage();

        const productLinks = await page.evaluate((selector) => {
            const links = [];

            const products = document.querySelectorAll(selector);
            products.forEach(product => {
                links.push(product.href);
            });

            return links;
        }, selector);

        return productLinks
    },
    // Extrahiert die href auf einer übergebenen Seite eines Elements mit einem übergebenen Query-Selektor.
    async getUrl(selector, page) {
        page ? page : page = this.lastPage();

        const url = await page.$eval(selector, (element) => {
            let href = element.getAttribute('href');
            
            return href;
        });

        return url;
    },
    // Extrahiert die src auf einer übergebenen Seite eines Bild-Elements mit einem übergebenen Query-Selektor.
    async getImageUrl(selector, page) {
        page ? page : page = this.lastPage();
        await this.waitSelector(selector, page);

        const imageUrl = await page.$eval(selector, img => img.getAttribute('src'));

        return imageUrl;
    },
    // Extrahiert den Textinhalt auf einer übergebenen Seite eines Elements mit einem übergebenen Query-Selektor.
    async getText(selector, page) {
        page ? page : page = this.lastPage();
        await this.waitSelector(selector, page);

        const text = await page.$eval(selector, element => element.textContent);

        return text;
    },
    // Schreibt Text in ein bestimmtes Textfeld auf einer übergebenen Seite eines Elements mit einem übergebenen Query-Selektor.
    async insert(selector, text, page) {
        page ? page : page = this.lastPage();
        await this.waitSelector(selector, page);

        await page.focus(selector);
        await page.keyboard.type(text);
    },
    // Tippt eine bestimmte Taste auf einer übergebenen Seite eines Elements mit einem übergebenen Query-Selektor.
    async press(selector, key, page) {
        page ? page : page = this.lastPage();
        await this.waitSelector(selector, page);

        await page.focus(selector);
        await page.keyboard.press(key);
    },
    // Lädt alle Dateien hoch auf einer übergebenen Seite eines Elements in einem Input-Feld vom Typen file.
    async uploadFiles(filePaths, page) {
        const selector = 'input[type=file]';
        page ? page : page = this.lastPage();
        await this.waitSelector(selector, page);
        
        for (let i=0; i<filePaths.length; i++) {
            const input = await page.$(selector);
            await input.uploadFile(filePaths[i]);
        }
    }
    
}

module.exports = {
    puppeteer
}