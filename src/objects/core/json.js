const fs = require('fs');
const path = require('path');

const json = {
    data: Object,
    path: {
        directory: '../exoversium-api/src/structure/json',
        file: String
    },
    jsons: Object,
    async getJsons() {
        this.jsons = {};
        const files = fs.readdirSync(this.path.directory);

        files.forEach(file => {
            const filePath = path.join(this.path.directory, file);
            
            if (file.endsWith('.json')) {
                const fileName = path.parse(file).name;
                this.jsons[fileName] = filePath;
            }
        });
    },
    async setFilePath(path) {
        this.path.file = path;
    },
    async read() {
        return new Promise((resolve, reject) => { 
            fs.readFile(this.path.file, 'utf8', (err, dataJson) => {
                if (err) {
                    console.log(err);
                    resolve();
                }

                this.data = JSON.parse(dataJson);
                resolve();
            });
        });
    },
    async save() {
        return new Promise((resolve, reject) => { 
            fs.writeFile(this.path.file, JSON.stringify(this.data, null, 2), 'utf8', (err) => {
                if (err) {
                    console.log(err)
                }

                resolve();
            });
        });
    }
}

module.exports = {
    json    
}