const Chance = require('chance');
const uniqid = require('uniqid');

const VIRUS_NAMES = [
    "APT1",
    "Spam",
    "Botnet",
    "StealCreds"
];

const FUNCTIONS = [
    "web server",
    "mail server",
    "ftp server"
];

const chance = new Chance();


function generateData () {
    
    const dataCount = chance.integer({ min: 0, max: 3 });

    return {
        "key": uniqid(),
        "ip": chance.ip(),
        "virus": VIRUS_NAMES.filter((virus, index)=>index <= dataCount),
        "owner": chance.bool({ likelihood: 65 })? chance.name() : chance.company(),
        "function": FUNCTIONS[ chance.integer({ min: 0, max: 2 }) ],
        dataCount,
        "coordinates": [
            chance.longitude(),
            chance.latitude()
        ]
    };
}




module.exports = {
    generateData
};