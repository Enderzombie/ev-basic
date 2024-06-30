const ms = require('ms');

const timeConverter = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        d: {
            name: String,
            value: Number
        },
        h: {
            name: String,
            value: Number
        },
        mi: {
            name: String,
            value: Number
        },
        s: {
            name: String,
            value: Number
        },
        ms: {
            name: String,
            value: Number
        },
    },
    // Die benötigten Einheiten.
    units: [
        { name: 'Tage', value: 'd' },
        { name: 'Stunden', value: 'h' },
        { name: 'Minuten', value: 'mi' },
        { name: 'Sekunden', value: 's' },
        { name: 'Millisekunden', value: 'ms' }
    ],
    // Konvertiert eine übergebene Zeit und eine übergebene Einheit in alle anderen Einheiten.
    convert(time, unit) {
        this.getMs(time, unit);
        this.getValues();
        this.getNames();
    },
    // Konvertiert die übergebene Zeit in Millisekunden.
    getMs(time, unit) {
        const fixedUnit = unit == 'mi' ? unit.slice(0, -1) : unit;
        const timeUnitString = `${time}`+`${fixedUnit}`;
        this.data.ms.value = ms(timeUnitString);
    },
    // Konvertiert die Millisekunden in alle anderen Einheiten.
    getValues() {
        this.data.s.value = this.data.ms.value / 1000;
        this.data.mi.value = this.data.s.value / 60;
        this.data.h.value = this.data.mi.value / 60;
        this.data.d.value = this.data.h.value / 24;
    },
    // Generiert einen korrekten Namen zu den Einheiten.
    getNames() {
        this.data.d.value !== 1 ? this.data.d.name = this.units[0].name : this.data.d.name = this.units[0].name.slice(0, -1);
        this.data.h.value !== 1 ? this.data.h.name = this.units[1].name : this.data.h.name = this.units[1].name.slice(0, -1);
        this.data.mi.value !== 1 ? this.data.mi.name = this.units[2].name : this.data.mi.name = this.units[2].name.slice(0, -1);
        this.data.s.value !== 1 ? this.data.s.name = this.units[3].name : this.data.s.name = this.units[3].name.slice(0, -1);
        this.data.ms.value !== 1 ? this.data.ms.name = this.units[4].name : this.data.ms.name = this.units[4].name.slice(0, -1);
    }
}


module.exports = {
    timeConverter
}
