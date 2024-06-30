const round = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        roundedNumbers: Array
    },
    // Rundet eine übergebene Zahl auf so viele verschiedene Nachkommastellen wie angegeben.
    all(number, maxDecimalPlaces) {
        !maxDecimalPlaces ? maxDecimalPlaces=100 : maxDecimalPlaces;
        this.data.roundedNumbers = [];

        for (let i=0; i<maxDecimalPlaces+1; i++) {
            const multiplier = Math.pow(10, i);
            const roundedNumber = {
                value: Math.round(number * multiplier) / multiplier,
                decimalPlace: i
            };
            this.data.roundedNumbers.push(roundedNumber);
        }
    }
}

module.exports = {
    round
}