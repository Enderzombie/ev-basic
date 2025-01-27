const chars = require('../../structure/json/chars.json');

const date = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        timeZone: String,
        now: Date,
        unix: Number,
        y: String, // Jahr
        m: String, // Monat
        d: String, // Tag
        wd: String, // Wochentag
        cw: String, // Kalenderwoche
        time: {
            h: String, // Stunde
            mi: String, // Minute
            s: String, // Sekunde
            formats: {
                twelve: String,
                twentyFour: String,
                utc: String,
                mez: String,
                est: String
            }
        },
        formats: {
            international: String,
            german: String,
            day: String
        }
    },
    // Alle Wochentage als String.
    weekDays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    // Alle Monate mit ihren Anzahl an Tagen.
    months: [   
        {
            name: 'Januar',
            days: 31
        },
        {
            name: 'Februar',
            days: 28
        },
        {
            name: 'März',
            days: 31
        },
        {
            name: 'April',
            days: 30
        },
        {
            name: 'Mai',
            days: 31
        },
        {
            name: 'Juni',
            days: 30
        },
        {
            name: 'Juli',
            days: 31
        },
        {
            name: 'August',
            days: 31
        },
        {
            name: 'September',
            days: 30
        },
        {
            name: 'Oktober',
            days: 31
        },
        {
            name: 'November',
            days: 30
        },
        {
            name: 'Dezember',
            days: 31
        }
    ],
    // Die verschiedenen, auswählbaren Zeitzonen.
    timeZones: {
        america: 'America/New_York',
        germany: 'Europe/Berlin'
    },
    // Die möglichen Zeitformate.
    formats: {
        date: {
            international: 'JJJJ-MM-DD',
            german: 'DD.MM.JJJJ',
        },
        time: {
            twelve: '[0, 12]:MI:SS [AM, PM]',
            twentyFour: '[0, 24]:MI:SS',
            utc: 'HH:MM:SS UTC-[1, 5]',
            mez: 'HH:MM:SS MEZ',
            est: 'HH:MM:SS EST'
        }
    },
    // Mit dieser zentralen Funktion können alle Daten gemäß eines angegebenen Datums sowie einer angegebenen Zeit extrahiert werden.
    set(date, time, timeZone) {
        this.data.timeZone = timeZone ? timeZone : this.timeZones.germany;

        if (!date && !time) return;
        if (date) {
            this.setDate(date);
        }
        
        if (time) {
            this.setTime(time);    
        }

        this.setNow();
        this.getCurrentWeek();
        this.getFormats();
    },
    // Extrahiert Daten anhand vom Datum.
    setDate(date) {
        const format = this.getFormat(date);
        if (!format) return;

        if (format == this.formats.date.international) {
            this.data.y = date.slice(0, 4);
            this.data.m = date.slice(5, 7);
            this.data.d = date.slice(8, 10);
        } else if (format == this.formats.date.german) {
            this.data.y = date.slice(6, 10);
            this.data.m = date.slice(3, 5);
            this.data.d = date.slice(0, 2);
        }
    },
    // Extrahiert Daten anhand von der Uhrzeit.
    setTime(time) {
        this.data.time.h = time.slice(0, 2);
        this.data.time.mi = time.slice(3, 5);
        this.data.time.s = time.slice(6, 8);
    },
    // Extrahiert ein new Date aus dem Datum sowie der Uhrzeit.
    setNow() {
        if (isNaN(this.data.time.h)) {
            this.data.now = new Date(
                this.data.y,
                this.data.m-1,
                this.data.d
            );
        } else {
            this.data.now = new Date(
                this.data.y,
                this.data.m-1,
                this.data.d,
                this.data.time.h,
                this.data.time.mi,
                this.data.time.s
            );
        }
        this.data.unix = Math.floor(this.data.now.getTime() / 1000);
    },
    // Mit dieser zentralen Funktion können alle Daten gemäß vom aktuellen Datum sowie der aktuellen Uhrzeit extrahiert werden.
    get(timeZone) {
        this.data.timeZone = timeZone ? timeZone : this.timeZones.germany;
        this.getNow();
        this.getCurrentDate();
        this.getCurrentTime();
        this.getCurrentWeek();
        this.getFormats();
    },
    // Extrahiert den aktuellen sowie exakten Zeitstempel.
    getNow() {
        this.data.now = new Date();
        this.data.unix = Math.floor(this.data.now.getTime() / 1000);
    },
    // Extrahiert das aktuelle Datum.
    getCurrentDate() {        
        this.data.y = this.data.now.toLocaleString('de-DE', { year: 'numeric', timeZone: this.data.timeZone });
        this.data.m = this.data.now.toLocaleString('de-DE', { month: '2-digit', timeZone: this.data.timeZone });
        this.data.d = this.data.now.toLocaleString('de-DE', { day: '2-digit', timeZone: this.data.timeZone });
    },
    // Extrahiert die aktuelle Uhrzeit.
    getCurrentTime() {
        const h = (this.data.now.toLocaleString('de-DE', { hour: '2-digit', timeZone: this.data.timeZone })).replace('Uhr', '').trim();
        const mi = this.data.now.toLocaleString('de-DE', { minute: '2-digit', timeZone: this.data.timeZone });
        const s = this.data.now.toLocaleString('de-DE', { second: '2-digit', timeZone: this.data.timeZone });
        this.data.time.h = Number(h) < 10 ? `0${Number(h)}` : h;
        this.data.time.mi = Number(mi) < 10 ? `0${Number(mi)}` : mi;
        this.data.time.s = Number(s) < 10 ? `0${Number(s)}` : s;
    },
    // Extrahier Daten aus der aktuellen Woche.
    getCurrentWeek() {
        this.data.wd = this.data.now.getDay();
        this.data.cw = this.getCalendarWeek();
    },
    // Ermittelt das Format des übergebenen Datums.
    getFormat(date) {
        if (date.length < 0 || date.length > 10 || [...date.toLowerCase()].some(char => chars.alphabet.lowercase.includes(char))) return;

        if (date.charAt(4) == '-') {
            return this.formats.date.international;
        } else if (date.charAt(2)== '.') {
            return this.formats.date.german;
        }
    },
    // Extrahiert alle verschiedenen Formate für das Datum sowie für die Uhrzeit.
    getFormats() {
        // Allgemeines Datumsformat.
        this.data.formats.international = `${this.data.y}-${this.data.m}-${this.data.d}`;
        this.data.formats.german = `${this.data.d}.${this.data.m}.${this.data.y}`;

        // 12-Uhr beziehungsweise 24-Uhr Darstellung der Uhrzeit.
        this.data.time.formats.twelve = `${this.data.time.h > 12 ? `0${this.data.time.h-12}` : this.data.time.h}:${this.data.time.mi}:${this.data.time.s} ${this.data.time.h > 12 ? 'PM' : 'AM'}`;
        this.data.time.formats.twentyFour = `${this.data.time.h}:${this.data.time.mi}:${this.data.time.s}`;

        // Ortsspezifische Uhrzeiten gemäß der entsprechenden Zeitzone.
        if (this.data.timeZone === this.timeZones.america) {
            this.data.time.formats.utc = `${this.data.time.h}:${this.data.time.mi}:${this.data.time.s} UTC-5`;
            var mezH = Number(this.data.time.h)+6; // Zeitverschiebung zwischen EST zu MEZ entspricht +6 Stunden.
            mezH = mezH < 24 ? mezH : mezH-24;
            this.data.time.formats.mez = `${mezH < 10 ? `0${mezH}` : mezH}:${this.data.time.mi}:${this.data.time.s} MEZ`;
            this.data.time.formats.est = `${this.data.time.h}:${this.data.time.mi}:${this.data.time.s} EST`;
        } else if (this.data.timeZone === this.timeZones.germany) {
            this.data.time.formats.utc = `${this.data.time.h}:${this.data.time.mi}:${this.data.time.s} UTC-1`;
            this.data.time.formats.mez = `${this.data.time.h}:${this.data.time.mi}:${this.data.time.s} MEZ`;
            var estH = this.data.time.h-6; // Zeitverschiebung zwischen MEZ zu EST entspricht -6 Stunden.
            estH = estH > 0 ? estH : estH+24;
            this.data.time.formats.est = `${estH < 10 ? `0${estH}` : estH}:${this.data.time.mi}:${this.data.time.s} EST`;
        }

        // Wochentag herausfinden.
        this.data.formats.day = this.weekDays[this.data.wd];
    },
    // Findet heraus, welche Kalenderwoche aktuell ist.
    getCalendarWeek() {
        // Quelle: ChatGPT 3.5
        let target  = new Date(this.data.now);
        let dayNr   = (target.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 4);
        let jan4    = new Date(target.getFullYear(), 0, 4);
        let dayDiff = (target - jan4) / 86400000;
        let cw      = Math.ceil(dayDiff / 7);
        return cw;
    },
    // Findet heraus, ob das Jahr ein Schaltjahr ist.
    leapDay() {
        // Quelle: ChatGPT 3.5
        // Das Jahr muss durch 4 teilbar sein. ODER Falls das Jahr durch 100 teilbar ist, muss es auch durch 400 teilbar sein.
        if (this.data.y % 4 === 0 && this.data.y % 100 !== 0 || this.data.y % 400 === 0) {
            this.months[1].days++; // Erhöht für den Monat Februar die Anzahl an Tagen, wenn es sich um ein Schaltjahr handelt.
        }
    },
    // Findet die Jahresdifferenz zwischen zwei Daten heraus.
    getYearDifference(dateFirst, dateCurrent) {
        const dateFirstYear = dateFirst.getFullYear();
        const dateCurrentYear = dateCurrent.getFullYear();
        const dateFirstMonth = dateFirst.getMonth();
        const dateCurrentMonth = dateCurrent.getMonth();
        const dateFirstDay = dateFirst.getDate();
        const dateCurrentDay = dateCurrent.getDate();
    
        if (dateCurrentYear <= dateFirstYear) {
            return 0;
        }

        // Grundlegende Differenz der Jahre
        let alter = dateCurrentYear - dateFirstYear;
    
        // Prüfen, ob der dateFirstDay dieses Jahr schon war
        if (
            dateCurrentMonth < dateFirstMonth || // Monat noch nicht erreicht
            (dateCurrentMonth === dateFirstMonth && dateCurrentDay < dateFirstDay) // Tag noch nicht erreicht
        ) {
            alter--;
        }
    
        return alter;
    }
}

module.exports = {
    date
}