const { badwords } = require('./src/objects/core/badwords');
const { calculator } = require('./src/objects/core/calculator');
const { childProcess } = require('./src/objects/core/childProcess');
const { colors } = require('./src/objects/core/colors');
const { date } = require('./src/objects/core/date');
const { fileSystem } = require('./src/objects/core/fileSystem');
const { json } = require('./src/objects/core/json');
const { object } = require('./src/objects/core/object');
const { puppeteer } = require('./src/objects/core/puppeteer');
const { round } = require('./src/objects/core/round');
const { time } = require('./src/objects/core/time');
const { timeConverter } = require('./src/objects/core/timeConverter');
const { translator } = require('./src/objects/core/translator');
const badwordsJson = require('./src/structure/json/badwords.json');
const charsJson = require('./src/structure/json/chars.json');
const discordEventsJson = require('./src/structure/json/discordEvents.json');

module.exports = {
    badwords,
    calculator,
    childProcess,
    colors,
    date,
    fileSystem,
    json,
    object,
    puppeteer,
    round,
    time,
    timeConverter,
    translator,
    badwordsJson,
    charsJson,
    discordEventsJson
}