'use strict';

require('dotenv').config();

const { EmailOutput } = require('./src/');
const { showResults, showStep } = require('./src/utils');

const {
    Case,
    Test
} = require('./src');

const {
    getFilesInDirectory,
} = require('./src/utils');

const results = [  ];

let cases;
let caseFiles;
let currentCase = 0;

/**
 * Populates the cases with its corresponding actions.
 * @function populateCases
 * @returns { array }
 */
const populateCases = () =>
{
    const temp = [  ];

    caseFiles.forEach(file =>
    {
        temp.push(new Case(file));
    });

    return temp;
}

/**
 * Runs the test.
 * @function runTest
 * @async
 */
const runTest = async () =>
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

            showStep(3);
            
            new EmailOutput(results);

            showStep(4);
        }
    });
}

/**
 * Runs the appliction.
 * @function init
 */
(function init()
{
    caseFiles = getFilesInDirectory(`./${process.env.CASE_FOLDER}`);
    cases = populateCases();

    showStep(1);

    runTest();
})();
