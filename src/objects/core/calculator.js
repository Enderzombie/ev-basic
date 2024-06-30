const chars = require('../../structure/json/chars.json');

const calculator = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        calculation: String,
        calculationMath: String,
        result: Number,
        calculated: Boolean,
        countClampOpen: Number,
        countClampClose: Number
    },
    // Alle benötigten Texte.
    texts: {
        infos: {
            default: '*Bitte drücke auf einen Button*',
            empty: '*Leer*',
            howToCalculate: '*Mit = kannst du deine Eingabe ausrechnen*'
        },
        errors: {
            syntax: 'Syntax Fehler',
            missingOperatorBetweenSquareAndNumber: 'Fehlende Zahl zwischen einem ² und einem Operator.',
            squareClamp: 'Das Quadrieren einer Klammer wird nicht unterstützt in dieser Version.'
        }
    },
    // Berechnet das Ergebnis anhand von der Rechnung.
    calculateResult() {
        try {
            this.data.calculationMath = this.data.calculation;
            this.checkIfSquaresInclude();
            
            this.data.result = eval(this.data.calculationMath);
        }
        catch(err) {
            if (this.data.calculationMath == this.texts.errors.squareClamp) {
                this.data.result = this.texts.errors.squareClamp;
            } else if (this.data.calculationMath == this.texts.errors.missingOperatorBetweenSquareAndNumber) { // Das ² wurde checkIfSquaresInclude() entfernt
                this.data.result = this.texts.errors.missingOperatorBetweenSquareAndNumber
            } else {
                this.data.result = this.texts.errors.syntax;
            }
        }

        this.data.calculated = true;
    },
    // Überprüft, ob die Rechnung ein Quadrat-Zeichen enthält. Falls ja, dann muss dieses auf mathematischer Ebene verändert werden.
    checkIfSquaresInclude() {
        if (this.data.calculation.includes('²')) {
            let calculationArray = this.data.calculation.split('');
    
            this.replaceSquares(calculationArray);
        }
    },
    // Überarbeitet die Rechnung, indem alle Quadrat-Zeichen ausgetauscht werden, beispielsweise wird 9² zu 9*9. Dies geschiet asynchron, damit alles korrekt funktioniert, falls mehrere Quadrat-Zeichen in der Rechnung enthalten sind.
    async replaceSquares(calculationArray) {
        return new Promise((resolve, reject) => {
            let replacedCalculation = this.data.calculation;
    
            for (let i = 0; i < calculationArray.length; i++) {
                if (calculationArray[i] === '²') {
                    const number = this.getNumberBeforeSquare(calculationArray, i - 1);
                    console.log(number);
                    if (!number.error) {
                        replacedCalculation = replacedCalculation.replace(`${number.value}²`, `${number.value}*${number.value}`);
                        console.log(replacedCalculation);
                    }
                }
            }
    
            this.data.calculationMath = replacedCalculation;
            resolve();
        });
    },
    // Extrahiert die Zahl vor dem Quadrat-Zeichen.
    getNumberBeforeSquare(calculationArray, index) {
        const number = {
            value: '',
            length: 0,
            error: false
        }

        for (let i=index; i>=0; i--) {
            if (chars.calculation.includes(calculationArray[i])) {
                if (number.value == '') {
                    if (calculationArray[i] == ')') {
                        this.data.calculationMath = this.texts.errors.squareClamp;
                    } else if (calculationArray[i] == '(') {
                        this.data.calculationMath = this.texts.errors.syntax;
                    } else {
                        this.data.calculationMath = this.texts.errors.missingOperatorBetweenSquareAndNumber;
                    }
    
                    number.error = true;
                }
                
                break;
            } else {
                number.value += calculationArray[i];
                number.length++;
            }
        }

        // Dreht die Zahl selbst um, da sie aufgrund vom obigen Algorithmus exakt umgekehrt extrahiert wurde.
        number.value = number.value.split('').reverse().join('');

        return number;
    },
    // Entfernt das letzte Zeichen aus der Rechnung.
    deleteLast() {
        this.data.calculation = this.data.calculation.slice(0, -1);

        if (this.data.calculation == '') {
            this.deleteAll();
        }    
    },
    // Setzt die komplette Rechnung zurück.
    deleteAll() {
        this.data.calculation = this.texts.infos.default;
        this.data.result = this.texts.infos.empty;
    },
    // Setzt ein Quadrats-Zeichen in die Rechnung ein.
    squareOperator() {
        this.isCalculated();

        // Sicherheitsabfrage, welche dafür sorgt, dass kein doppeltes Quadrat-Zeichen hintereinander entstehen kann, mit welchem der restliche Code falsch umgehen würde, beispielsweise 9²².
        if (this.data.calculation.endsWith('²')) {
            return;
        }

        this.data.calculation += '²';
    },
    // Setzt korrekt eine Klammer in die Rechnung ein.
    setClamp() {
        this.isCalculated();
        this.getCountOfClamps();
    
        if (this.data.countClampOpen == this.data.countClampClose) {
            this.data.calculation += '(';
        } else {
            this.data.calculation += ')';
        }
    },
    // Zählt die Anzahl der in der Rechnung enthaltenen Klammern, getrennt in geöffnete und geschlossene Klammern.
    getCountOfClamps() {
        let calculationArray = this.data.calculation.split('');
        this.data.countClampOpen = 0;
        this.data.countClampClose = 0;

        for (let i=0; i<calculationArray.length; i++) {
            if (calculationArray[i] == '(') {
                this.data.countClampOpen++;
            } else if (calculationArray[i] == ')') {
                this.data.countClampClose++;
            }
        }
    },
    // Setzt ein übergebenes Zeichen in die Rechnung ein.
    appendOperation(operation) {
        this.isCalculated();
    
        this.data.calculation += operation;
    },
    // Überprüft, ob die Rechnung bereits ausgerechnet wurde. Falls ja, dann setze den String vom Ergebnis zurück.
    isCalculated() {
        if (this.data.calculated) {
            this.data.result = this.texts.infos.howToCalculate;
            this.data.calculated = false;
        }
    },
    // Extrahiert alle benötigten Daten anhand von einem übergebenen Discord Embed.
    getCurrentValues(embed) {
        if (embed.fields[1].value === this.texts.infos.empty) {
            this.data.calculated = false;
            this.data.calculation = '';
            this.data.result = this.texts.infos.howToCalculate;
        } else {
            // Wenn der String vom Ergebnis keine Zahl ist, dann wurde die Rechnung noch nicht ausgerechnet, andernfalls schon.
            isNaN(Number(this.data.result)) ? this.data.calculated = false : this.data.calculated = true;
            this.data.calculation = embed.fields[0].value;
            this.data.result = embed.fields[1].value;
        }
    }
}

module.exports = {
    calculator
}