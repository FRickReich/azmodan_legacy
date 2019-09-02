'use strict';

const color = require("cli-color");

/**
 * Shows results of all test-cases.
 * @function showResults
 * @param { object } results 
 */
const showResults = (results) =>
{
    results.forEach(result =>
    {
        console.log(color.bold.underline(`Results for "${ result.caseTitle }":`));

        result.amount.passed && console.log(color.green(`- ${result.amount.passed === result.actions.length ? 'all' : result.amount.passed } passed`));
        result.amount.failed && console.log(color.red(`- ${result.amount.failed === result.actions.length ? 'all' : result.amount.failed } failed`));

        if (result.failureMessage)
        {
            console.log(`\n${ color.bold('Breakpoint:') }\n${ color.red(result.failureMessage) }\n`);
        }
        else
        {
            console.log('');
        }
    });
}

/**
 * Shows results of all test-cases.
 * @function showStep
 * @param { object } results 
 */
const showStep = (step) =>
{
    switch (step) {
        case 1:
            console.log(color.bold("1.) Running tests"));
            break;
        case 2:
            console.log(color.bold("2.) Showing results\n"));
            break;
        case 3:
            console.log(color.bold("3.) Sending email with results\n"));
            break;
    }
}


module.exports.showResults = showResults;
module.exports.showStep = showStep;