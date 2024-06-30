const fs = require('fs');
const path = require('path');

const fileSystem = {
    // Die entsprechenden Daten, welche durch die Funktionen gefüllt werden.
    data: {
        directoryPath: String,
        files: Array,
        directorys: Array,
        totalLines: Number
    },
    // Setzt einen beliebigen Dateipfad eines Ordners.
    setDirectory(directoryPath) {
        this.data.directoryPath = directoryPath;
    },
    // Extrahiert aus dem Oberverzeichnis alle Namen der Unterverzeichnisse.
    async getAllDirectorys() {
        this.data.directorys = [];

        const directoryNames = (await fs.promises.readdir(this.data.directoryPath, { withFileTypes: true }))
        .filter(file => file.isDirectory())
        .map(folder => folder.name);

        for (let i=0; i<directoryNames.length; i++) {
            const directoryConstructor = {
                name: directoryNames[i]
            }

            this.data.directorys.push(directoryConstructor);
        }
    },
    // Extrahiert aus allen Dateien, gemäß des Dateipfades, benötigte Daten.
    async getAllFiles(directoryPath = this.data.directoryPath) {
        try {
            this.data.totalLines = 0;
            this.data.files = [];
            const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    
            // Array, um alle asynchronen Operationen zu speichern.
            const promises = [];
    
            for (const file of files) {
                const filePath = path.join(directoryPath, file.name);
    
                if (file.isDirectory()) {
                    promises.push(this.getAllFiles(filePath));
                } else {
                    promises.push(this.countLines(filePath).then(countLines => {
                        const newFile = {
                            name: filePath,
                            lines: countLines
                        };
                        this.data.files.push(newFile);
                    }));
                }
            }
    
            // Warte darauf, dass alle asynchronen Operationen abgeschlossen sind.
            await Promise.all(promises);    
        } catch (err) {
            console.error(err);
        }
    },        
    // Zählt die Anzahl an Codezeilen pro Datei und speichert in totalLines die Summe aus allen Codezeilen.
    async countLines(filePath) {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const lines = data.split('\n');
            this.data.totalLines += lines.length;
            return lines.length;
        } catch (err) {
            console.error(err);
        }
    },
    // Lädt den Inhalt einer übergebenen Datei und gibt diesen zurück.
    async readFile(filePath) {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return data;
    }
}

module.exports = {
    fileSystem
}