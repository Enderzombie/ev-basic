const time = {
    async sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time)
        });
    }
}

module.exports = {
    time
}