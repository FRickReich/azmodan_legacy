'use strict';

require('dotenv').config();

const { EmailOutput } = require('./src/emailOutput');
const { showResults, showStep } = require('./src/utils');

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
let results = [];

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
        results.push(result);

        currentCase++;

        if (currentCase < cases.length)
        {
            runTest();
        }
        else
        {
            showStep(2);
            
            showResults(results);
            
            new EmailOutput(results);
        }
    });
}

(function init()
{
    showStep(1);

    caseFiles = getFilesInDirectory(`./${process.env.CASE_FOLDER}`);
    cases = populateCases();

    runTest();
})();
