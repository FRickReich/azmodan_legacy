'use strict';

require('dotenv').config();

const {
    Case,
    Test
} = require('./src');

const {
    getFilesInDirectory,
} = require('./src/utils');

let caseFiles = [];
let cases = [];
let currentCase = 0;

const populateCases = () =>
{
    const temp = [];

    caseFiles.forEach(file =>
    {
        temp.push(new Case(file));
    });

    return temp;
}

const runTest = () =>
{
    const runningCase = cases[currentCase];
    const test = new Test(runningCase);

    test.startTest((result) =>
    {
        console.log(result);

        currentCase++;

        if (currentCase < cases.length)
        {
            runTest();
        }
        else
        {
            // SHOW RESULTS    
        }
    });
}

(function init()
{
    caseFiles = getFilesInDirectory(`./${process.env.CASE_FOLDER}`);
    cases = populateCases();

    runTest();
})();
