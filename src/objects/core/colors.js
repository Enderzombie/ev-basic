const colors = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        random: Number
    },
    // Alle wichtigen Farben basierend auf unserer Marke.
    branding: {
        blue: '#00689e',
        darkBlue: '#004aad',
        skyBlue: '#459cc8',
        red: '#a60a1a',
        grey: '#888888',
        black: '#000000',
        white: '#ffffff'
    },
    // Generiert eine zufällige Farbe.
    getRandom() {
        this.data.random = Math.floor(Math.random() * (0xffffff + 1));
    }
}

module.exports = {
    colors
}