const assert = require('assert');
const csvParse = require('../app/csv-parse.js');

describe('setHeaders', function() {
  it('Receives a header array and sets the headers for the dataSet and types object', function() {
    let headers = ['Dates', 'Text', 'MC1', 'MC2'];
    let dataSet = {};
    let types = {};
    csvParse.setHeaders(headers, dataSet, types);
    let answer1 = {'Dates': [], 'Text': [], 'MC1': [], 'MC2': []};
    let answer2 = {'Dates': undefined, 'Text': undefined, 'MC1': undefined, 'MC2': undefined};
    
    assert.deepEqual(dataSet, answer1, 'dataSet is equal to csvParse.setHeaders()');
    assert.deepEqual(types, answer2, 'types is equal to csvParse.setHeaders()');
  });
});

describe('flatten', function() {
  it('Flattens the dataSet object into a column based structure', function() {
    let stream = [{'Dates': '2011-10-10', 'Text': 'Bah', 'MC1': 'True', 'MC2': 'A'}, 
                  {'Dates': '1/26/15 12:05', 'Text': 'Loblaw', 'MC1': 'True', 'MC2': 'A'},
                  {'Dates': '14-Mar', 'Text': 'Alexis Berk', 'MC1': 'False', 'MC2': 'A'}, 
                  {'Dates': '11/4/14 10:51', 'Text': 'Alphonse Forestier', 'MC1': 'False', 'MC2': 'B'},
                  {'Dates': '10/22/14 13:30', 'Text': 'Alton McRee', 'MC1': 'False', 'MC2': 'C'}];

    let dataSet = {'Dates': [], 'Text': [], 'MC1': [], 'MC2': []};
    stream.forEach(function(data) {
        csvParse.flatten(data, dataSet);
    });   
    
    let flattened = {'Dates': ['2011-10-10', '1/26/15 12:05', '14-Mar', '11/4/14 10:51', '10/22/14 13:30'],
                     'Text': ['Bah', 'Loblaw', 'Alexis Berk', 'Alphonse Forestier', 'Alton McRee'],
                     'MC1': ['True', 'True', 'False', 'False', 'False'],
                     'MC2': ['A', 'A', 'A', 'B', 'C']};

    assert.deepEqual(dataSet, flattened, 'dataSet is equal to the flattened stream');
  });
});

describe('identifyDateType', function() {
  it('Identifies the date/time columns', function() {
    let types = {'Dates': undefined, 'Text': undefined, 'MC1': undefined, 'MC2': undefined};
    let data = {'Dates': ['2011-10-10', '1/26/15 12:05', '14-Mar', '11/4/14 10:51', '10/22/14 13:30'],
                     'Text': ['Bah', 'Loblaw', 'Alexis Berk', 'Alphonse Forestier', 'Alton McRee'],
                     'MC1': ['True', 'True', 'False', 'False', 'False'],
                     'MC2': ['A', 'A', 'B', 'B', 'B']};
    csvParse.identifyDateType(data, types);   
    let answer = {'Dates': {type: 'Date/Time'}, 'Text': undefined, 'MC1': undefined, 'MC2': undefined};

    assert.deepEqual(types, answer, 'maybeFirst([1, 2, 3]) is 1');
  });
});

describe('checkForMc', function() {
  it('Identifies the Multiple Choice columns', function() {
    let types = {'Dates': undefined, 'Text': undefined, 'MC1': undefined, 'MC2': undefined};
    let data = {'Dates': ['2011-10-10', '1/26/15 12:05', '14-Mar', '11/4/14 10:51', '10/22/14 13:30'],
                     'Text': ['Bah', 'Loblaw', 'Alexis Berk', 'Alphonse Forestier', 'Alton McRee'],
                     'MC1': ['True', 'True', 'False', 'False', 'False'],
                     'MC2': ['A', 'A', 'B', 'B', 'B']};
    csvParse.checkForMc(data, types);   
    let answer = {'Dates': undefined, 'Text': undefined, 'MC1': {type: 'Multiple Choice', options: ['True', 'False']}, 'MC2': {type: 'Multiple Choice', options: ['A', 'B']}};

    assert.deepEqual(types, answer, 'maybeFirst([1, 2, 3]) is 1');
  });
});

describe('checkForText', function() {
  it('Identifies the text columns', function() {
    let types = {'Dates': {type: 'Date/Time'}, 'Text': undefined, 'MC1': {type: 'Multiple Choice', options: ['True', 'False']}, 'MC2': {type: 'Multiple Choice', options: ['A', 'B', 'C']}};
    let data = {'Dates': ['2011-10-10', '1/26/15 12:05', '14-Mar', '11/4/14 10:51', '10/22/14 13:30'],
                     'Text': ['Bah', 'Loblaw', 'Alexis Berk', 'Alphonse Forestier', 'Alton McRee'],
                     'MC1': ['True', 'True', 'False', 'False', 'False'],
                     'MC2': ['A', 'A', 'B', 'B', 'B']};
    csvParse.checkForText(data, types);   
    let answer = {'Dates': {type: 'Date/Time'}, 'Text': { type: 'Text'}, 'MC1': {type: 'Multiple Choice', options: ['True', 'False']}, 'MC2': {type: 'Multiple Choice', options: ['A', 'B', 'C']}};

    assert.deepEqual(types, answer, 'maybeFirst([1, 2, 3]) is 1');
  });
});