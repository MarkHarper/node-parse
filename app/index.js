const fs = require('fs');
const csv = require('csv-parser');
const csvParse = require('./csv-parse.js');

let dataSet = {};
let types = {};

fs.createReadStream('./data/contacts.csv')
    .pipe(csv())
    .on('headers', function (headers) {
        csvParse.setHeaders(headers, dataSet, types);
      })
    .on('data', function (data) {
        csvParse.flatten(data, dataSet, types);
    })
    .on('end', function (data) {
        csvParse.identifyDateType(dataSet, types);
        csvParse.checkForMc(dataSet, types);
        csvParse.checkForText(dataSet, types);
        console.log(types);
    });