'use strict';

require('dotenv').config();
const puppeteer = require('puppeteer');

const { TerminalOutput } = require('./terminalOutput');
const {
    handleTimeDifference
} = require('./utils');

class Test
{
    /**
     * @constructor
     * @param { object } data
     */
    constructor(caseData)
    {
        this.case = caseData;
        this.stepCounter = this.case.getQueueSize();
        this.startTime;
        this.endTime;
        this.state = false;
        this.steps = [  ];
        this.passedSteps = 0;
        this.failedSteps = 0;
        this.failureMessage = '';
        this.screenshotFolder = process.env.SCREENSHOTS_FOLDER ? `./${ process.env.SCREENSHOTS_FOLDER }` : './screenshots';
    }

    /**
     * Gets the timestamp of the current tests initiation.
     * @method getStartTime
     * @returns { number }
     */
    getStartTime()
    {
        return this.startTime;
    }

    /**
     * Gets the timestamp of when the current test-case finished.
     * @method getEndTime
     * @returns { number }
     */
    getEndTime()
    {
        return this.endTime;
    }

    /**
     * Gets the final state of the current test-case.
     * @method getState
     * @returns { boolean }
     */
    getState()
    {
        return this.state;
    }

    /**
     * Gets a list of all steps that are part of the current test-case.
     * @method getSteps
     * @returns { object }
     */
    getSteps()
    {
        return this.steps;
    }

    /**
     * Gets the count of all steps in current case.
     * @method getStepCounter
     * @returns { number }
     */
    getStepCounter()
    {
        return this.stepCounter;
    }

    /**
     * ON FAILED: Gets the failure message of the current test-case.
     * @method getFailureMessage
     * @returns { string }
     */
    getFailureMessage()
    {
        return this.failureMessage;
    }

    /**
     * Gets the amount of passed steps.
     * @method getPassedStepsAmount
     * @returns { number }
     */
    getPassedStepsAmount()
    {
        return this.passedSteps;    
    }

    /**
     * Gets the amount of failed steps.
     * @method getFailedStepsAmount
     * @returns { number }
     */
    getFailedStepsAmount()
    {
        return this.failedSteps;
    }

    /**
     * Gets the screenshot folders name.
     * @method getScreenshotFolder
     * @return { string }
     */
    getScreenshotFolder()
    {
        return this.screenshotFolder;
    }

    /**
     * Sets the final state of the current test-case.
     * @method setState
     * @param { bool } state 
     */
    setState(state)
    {
        this.state = state;
    }

    /**
     * Sets the steps taken in the current test-case.
     * @method setSteps
     * @param { number } timestamp
     * @param { string } description
     * @param { bool } state
     */
    setSteps(timestamp, description, state)
    {
        this.steps.push(
            {
                timestamp,
                description,
                state
            }
        );
    }

    /**
     * ON FAILED: Sets the current test-cases failure message.
     * @method setFailureMessage
     * @param { string } message
     */
    setFailureMessage(message)
    {
        this.failureMessage = message;
    }

    /**
     * Increments the amount of passed steps.
     * @method incrementPassedStepAmount
     */
    incrementPassedStepAmount()
    {
        this.passedSteps++;
    }
    /**
     * Increments the amount of failed steps.
     * @method incrementFailedStepsAmount
     */
    incrementFailedStepAmount()
    {
        this.failedSteps++;
    }

    /**
     * Calculates the timestamp of the test-cases initialization.
     * @method calculateStartTime
     */
    calculateStartTime()
    {
        this.startTime = new Date().getTime();
    }

    /**
     * Calculates the time the test case took from start to finish.
     * @method calculateRunningTime
     * @returns { number }
     */
    calculateRunningTime()
    {
        return handleTimeDifference(this.startTime, this.steps[this.steps.length - 1].timestamp);
    }

    /**
     * Calculates the timestamp of when the current test-case finished.
     * @method calculateEndTime
     */
    calculateEndTime()
    {
        this.endTime = this.steps[this.steps.length - 1].timestamp
    }

    /**
     * Starts the current test-case.
     * @method startTest
     * @param { function } callback 
     */
    startTest(callback)
    {
        const caseTitle = this.case.getTitle();

        this.calculateStartTime();

        const terminal = new TerminalOutput();
        terminal.setTitle(caseTitle);
        terminal.createTable();
        terminal.showTable();

        puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        }).then(async browser =>
        {
            const page = await browser.newPage();

            await page.setViewport({ width: 1280, height: 800 });

            for (let index = 0; index < this.stepCounter; index++)
            {
                const currentStep = this.case.getNextItemInQueue();

                if (currentStep.getData('delay'))
                {
                    await page.waitFor(currentStep.getData('delay'));
                }

                switch (currentStep.getData('type'))
                {
                    case 'visit':
                        await page.goto(currentStep.getData('url')).then(() =>
                        {
                            currentStep.setState(true);
                        }).catch((e) =>
                        {
                            currentStep.setState(false);

                            this.setFailureMessage(currentStep.getErrorMessage() ? `Step ${terminal.getCounter() + 1}: ${currentStep.getErrorMessage()}` : e);
                        });
                        break;
                    case 'fill':
                        await page.type(currentStep.getData('target'), currentStep.getData('content')).then(() =>
                        {
                            currentStep.setState(true);
                        }).catch((e) =>
                        {
                            currentStep.setState(false);

                            this.setFailureMessage(currentStep.getErrorMessage() ? `Step ${terminal.getCounter() + 1}: ${currentStep.getErrorMessage()}` : e);
                        });
                        break;
                    case 'click':
                        await page.click(currentStep.getData('target')).then(() =>
                        {
                            currentStep.setState(true);
                        }).catch((e) =>
                        {
                            currentStep.setState(false);

                            this.setFailureMessage(currentStep.getErrorMessage() ? `Step ${terminal.getCounter() + 1}: ${currentStep.getErrorMessage()}` : e);
                        });
                        break;
                    case 'press':
                        await page.keyboard.press(currentStep.getData('key')).then(() =>
                        {
                            currentStep.setState(true);
                        }).catch((e) =>
                        {
                            currentStep.setState(false);

                            this.setFailureMessage(currentStep.getErrorMessage() ? `Step ${terminal.getCounter() + 1}: ${currentStep.getErrorMessage()}` : e);
                        });
                        break;
                    case 'console':
                        break;
                    case 'read':
                        break;
                }

                terminal.increaseCounter();
                
                this.setSteps(new Date().getTime(), currentStep.getDescription(), currentStep.getState());

                terminal.createRow(new Date().getTime(), currentStep.getDescription(), currentStep.getState());

                if (currentStep.getState() === false)
                {
                    this.incrementFailedStepAmount();

                    terminal.setBreakpoint();

                    for (let idx = 0; idx <= this.case.getQueueSize(); idx++)
                    {       
                        const currentStep = this.case.getNextItemInQueue();

                        terminal.increaseCounter();

                        this.incrementFailedStepAmount();

                        this.setSteps(new Date().getTime(), currentStep.getDescription(), false);

                        terminal.createRow("", currentStep.getDescription(), false);
                    }

                    await page.waitFor(1000);
                    await page.screenshot({ path: `${this.getScreenshotFolder()}/screenshot_${ caseTitle.split(" ").join("-").toLowerCase() }_step${ terminal.getBreakpoint() }_error.png`, fullPage: true });

                    break;
                }
                else
                {
                    if(this.getPassedStepsAmount() === this.getStepCounter() - 1)
                    {
                        await page.waitFor(1000);
                        await page.screenshot({ path: `${this.getScreenshotFolder()}/screenshot-${ caseTitle.split(" ").join("-").toLowerCase() }_passed.png`, fullPage: true });
                    }

                    this.incrementPassedStepAmount();
                    this.setState(true);
                }
            }

            await browser.close().then(() =>
            {
                this.calculateEndTime();

                terminal.createFooter(this.getFailedStepsAmount(), this.calculateRunningTime());

                callback({
                    caseTitle: this.case.getTitle(),
                    time: {
                        start: this.getStartTime(),
                        end: this.getEndTime(),
                        running: this.calculateRunningTime()
                    },
                    state: this.getState(),
                    steps: this.getSteps(),
                    amount: {
                        passed: this.getPassedStepsAmount(),
                        failed: this.getFailedStepsAmount()
                    },
                    failureMessage: this.getFailureMessage()
                });
            });
        });
    }
}

module.exports = { Test };
