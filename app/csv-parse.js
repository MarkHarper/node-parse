const fs = require('fs');
const csv = require('csv-parser');

let dataSet = {};
let types = {};

fs.createReadStream('./data/contacts.csv')
    .pipe(csv())
    .on('headers', setHeaders)
    .on('data', flatten)
    .on('end', function (data) {
        identifyDateType(dataSet);
        checkForMc(dataSet);
        checkForText(dataSet);
        console.log(types);
    });

function setHeaders (headers) {
    headers.forEach(function(element) {
        if (element.length !== 0) {
            types[element] = undefined;
            dataSet[element] = [];
        }
    });
}

function flatten (data) {
    for (header in dataSet) {
        dataSet[header].push(data[header]);
    }
}

function identifyDateType (data) {
    for (category in data) {
        var x = 0;
        data[category].forEach(function(item) {
            if (new Date(item).toString() !== 'Invalid Date') {
                x++;
            }
        });
        if (x > data[category].length/2) {
            types[category] = {type: 'Date/Time' };
        }
    }
}

function checkForText (data) {
    for (category in data) {
        let stringCount = 0;
        data[category].forEach(function(item) {
            if (typeof data[item] === 'string' && data[item].match(/"^[a-zA-Z0-9_]*$"/)) {
                stringCount++;
            }
        });
        if (stringCount < data[category].length/2 && types[category] === undefined) {
            types[category] = { type: 'Text'};
        }
    }
}

function checkForMc (data) {
    for (category in data) {
        let options = {};
        data[category].forEach(function(item) {
            if (options[item]) {
                options[item]++;
            } else {
                options[item] = 1;
            }
        });
        if (Object.keys(options).length < data[category].length/2 && types[category] === undefined) {
            types[category] = { type: 'Multiple Choice', options: Object.keys(options)};
        }
    }
}
 