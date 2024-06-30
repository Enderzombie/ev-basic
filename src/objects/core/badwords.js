const Filter = require('bad-words');

const badwords = {
    filter: new Filter(),
    custom: (require('../../structure/json/badwords.json')).custom,
    // Überprüft, ob in einem Text ein "Badword" enthalten ist.
    contains(text) {
        this.filter.addWords(...this.custom);
        
        return this.filter.isProfane(text);
    },
    // Gibt die Liste an allen "Badwords" zurück.
    list() {
        return this.filter.list;
    }
}

module.exports = {
    badwords
}