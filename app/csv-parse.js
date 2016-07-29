exports.setHeaders = function (headers, dataSet, types) {
    headers.forEach(function(element) {
        if (element.length !== 0) {
            types[element] = undefined;
            dataSet[element] = [];
        }
    });
    return dataSet;
}

exports.flatten = function (data, dataSet) {
    for (header in dataSet) {
        dataSet[header].push(data[header]);
    }
    return dataSet;
}

exports.identifyDateType = function (data, types) {
    for (category in data) {
        var x = 0;
        data[category].forEach(function(item) {
            if (new Date(item).toString() !== 'Invalid Date' || new Date(item).toTimeString() !== 'Invalid Date') {
                x++;
            }
        });
        if (x > data[category].length/2) {
            types[category] = {type: 'Date/Time' };
        }
    }
    return types;
}

exports.checkForText = function (data, types) {
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
    return types;
}

exports.checkForMc = function (data, types) {
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
    return types;
}
 