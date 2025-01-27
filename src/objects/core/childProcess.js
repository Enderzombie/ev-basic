const { exec } = require('child_process');

const childProcess = {
    // Führt einen cmd-Befehl ganz normal aus.
    async exec(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    resolve(error);
                } else if (stderr) {
                    resolve(new Error(stderr));
                } else {
                    resolve(stdout);
                }
            });
        });
    },
    // Führt einen cmd-Befehl aus mit der Besonderheit, dass im Anschluss der Parameter input in das cmd-Feld eingegeben wird.
    async execWrite(command, input) {
        return new Promise((resolve, reject) => {
            const child = exec(command, { stdio: 'pipe' }, (error, stdout, stderr) => {
                if (error) {
                    resolve(error);
                } else if (stderr) {
                    resolve(stderr);
                } else {
                    resolve(stdout);
                }
            });

            child.stdin.write(input + '\n');
            child.stdin.end();
        });
    },
    async execGetWithRegex(command, regex) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                var match = '';
                if (error) {
                    resolve(error);
                } else if (stderr) {
                    resolve(new Error(stderr));
                } else {
                    match = stdout.match(regex);
                    resolve(match);
                }
            });
        });
    }
}

module.exports = {
    childProcess
}