const { puppeteer } = require('./puppeteer');

const translator = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        translations: Array
    },
    // Alle verfügbaren Sprachen mit ihren Abkürzungen.
    languages: [
        { name: 'deutsch', value: 'de' },
        { name: 'englisch', value: 'en' },
        { name: 'griechisch', value: 'el' },
        { name: 'russisch', value: 'ru' },
        { name: 'bulgarisch', value: 'bg' },
        { name: 'italienisch', value: 'it' },
        { name: 'schwedisch', value: 'sv' },
        { name: 'chinesisch', value: 'zh' },
        { name: 'japanisch', value: 'ja' },
        { name: 'slowakisch', value: 'sk' },
        { name: 'dänisch', value: 'da' },
        { name: 'lettisch', value: 'lv' },
        { name: 'slowenisch', value: 'sl' },
        { name: 'litauisch', value: 'lt' },
        { name: 'spanisch', value: 'es' },
        { name: 'niederländisch', value: 'nl' },
        { name: 'tschechisch', value: 'cs' },
        { name: 'estnisch', value: 'et' },
        { name: 'polnisch', value: 'pl' },
        { name: 'ungarisch', value: 'hu' },
        { name: 'finnisch', value: 'fi' },
        { name: 'portugiesisch', value: 'pt' },
        { name: 'französisch', value: 'fr' },
        { name: 'rumänisch', value: 'ro' } 
    ],
    // Generiert alle Übersetzungen beziehungsweise die Links zu ihnen anhand von einem übergebenen Text-Objekt.
    getTranslations(text) {
        const translateText = text.value.split(' ').join('%20');
        const languageAbbreviation = this.getLanguage(text.language).value;
        this.data.translations = [];

        for (let i=0; i<this.languages.length; i++) {
            const translation = {
                name: this.languages[i].name,
                url: `https://deepl.com/translator#${languageAbbreviation}/${this.languages[i].value}/${translateText}`
            }

            this.data.translations.push(translation);
        }
    },
    // Generiert die exakte Übersetzung in eine Sprache.
    async getTranslation(languageAbbreviation) {
        for (let i=0; i<this.languages.length; i++) {
            if (languageAbbreviation == this.languages[i].value) {
                const translationText = await this.getTranslationText(this.data.translations[i].url);
                
                const translation = {
                    text: translationText,
                    language: this.data.translations[i].name,
                    url: this.data.translations[i].url
                }

                return translation;
            }
        }
    },
    // Extrahiert mit Hilfe vom puppeteer-Objekt den übersetzten Text von Deepl.
    async getTranslationText(url) {
        return new Promise(async function (resolve, reject) {
            await puppeteer.openBrowser();   
            await puppeteer.openPage(url);
    
            setTimeout(async () => {
                const translationText = await puppeteer.getText('#textareasContainer > div:nth-child(3) > section > div > d-textarea > div');

                await puppeteer.closeBrowser();
    
                resolve(translationText);
            }, 3000);    
        });
    },
    // Gibt anhand einer Sprachen-Abkürzung die dazugehörige Sprache aus den verfügbaren Sprachen zurück.
    getLanguage(languageAbbreviation) {
        for (let i=0; i<this.languages.length; i++) {
            if (languageAbbreviation == this.languages[i].value) {
                const language = {
                    name: this.languages[i].name,
                    value: this.languages[i].value
                }

                return language;
            }
        }
    }
}

module.exports = {
    translator
}