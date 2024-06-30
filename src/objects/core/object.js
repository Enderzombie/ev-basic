const { round } = require('./round');

const object = {
    types: {
        string: 'string',
        number: 'number',
        undefined: 'undefined'
    },
    dates: [ // Hier müssen die key-Namen eingetragen werden von allen keys, bei welchen der type sowohl Date als auch Object ist.
        'now' // Dazugehöriges Objekt: core/date
    ],
    // Mit dieser Funktion lassen sich alle Werte eines übergebenen Objekts in einen bestimmten Type konvertieren.
    changeType(obj, type, ignoreSubObjects) {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !this.dates.includes(key)) {
                ignoreSubObjects ? console.log() : this.changeType(obj[key], type);
            } else {
                if (type == this.types.string) {
                    obj[key] = String;
                } else if (type == this.types.number) {
                    obj[key] = Number;
                }
            }
        }
        return obj;
    },
    // Mit dieser Funktion lassen sich alle Werte eines übergebenen Objekts in einen bestimmten Wertetypen wie Zahl oder Zeichenkette konvertieren.
    convertInto(obj, type, ignoreSubObjects) {
        for (let key in obj) {
            if (obj[key] instanceof Object && obj[key] !== null && !this.dates.includes(key)) {
                ignoreSubObjects ? console.log() : this.convertInto(obj[key], type);
            } else {
                if (type == this.types.string) {
                    if (obj[key] instanceof Date) {
                        obj[key] = obj[key].toISOString();
                    } else {
                        obj[key] = obj[key].toString();
                    }
                } else if (type == this.types.number) {
                    obj[key] = !isNaN(Number(obj[key])) ? Number(obj[key]) : obj[key];
                }
            }
        }
        return obj;
    },
    // Mit dieser Funktion lassen sich alle Werte eines übergebenen Objekts runden auf zwei Nachkommastellen, sofern es sich um eine Zahl handelt.
    roundTwo(obj, type, ignoreSubObjects) {
        for (let key in obj) {
            if (obj[key] instanceof Object && obj[key] !== null && !this.dates.includes(key)) {
                ignoreSubObjects ? console.log() : this.roundTwo(obj[key], type);
            } else {
                if (type == this.types.number && !isNaN[key]) {
                    round.all(obj[key]);
                    obj[key] = round.data.roundedNumbers[2]?.value;
                }
            }
        }
        return obj;
    },
    // Mit dieser Funktion lassen sich alle Werte eines übergebenen Objekts löschen bzw. überschreiben.
    clear(obj, type, ignoreSubObjects) {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !this.dates.includes(key)) {
                ignoreSubObjects ? console.log() : this.clear(obj[key], type);;
            } else {
                if (type == this.types.string) {
                    obj[key] = '';
                } else if (type == this.types.number) {
                    obj[key] = 0;
                } else if (type == this.types.undefined) {
                    obj[key] = undefined;
                }
            }
        }
        return obj;
    },
    // Mit dieser Funktion lassen sich alle Leerzeichen sowie \n aus allen Strings eines Objektes entfernen.
    cleanUp(obj) {
        const cleanedObj = {};
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            cleanedObj[key] = obj[key].trim().replace(/\n/g, '');
          } else {
            cleanedObj[key] = obj[key];
          }
        }
        return cleanedObj;
    }
}

module.exports = {
    object
}