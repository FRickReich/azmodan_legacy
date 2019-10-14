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
        
        this._case = caseData;
        this._stepCounter = this._case.queueSize;
        this._screenshotFolder = process.env.SCREENSHOTS_FOLDER ? `./${ process.env.SCREENSHOTS_FOLDER }` : './screenshots';
        this._state = false;
        this._steps = [  ];
        this._passedSteps = 0;
        this._failedSteps = 0;
        this._failureMessage = '';
        this._startTime;
        this._endTime;
    }

    get state()
    {
        return this._state;
    }
    get case()
    {
        return this._case;
    }
    get passedSteps()
    {
        return this._passedSteps;
    }
    get stepCounter()
    {
        return this._stepCounter;
    }
    get failureMessage()
    {
        return this._failureMessage;
    }
    get steps()
    {
        return this._steps;
    }
    get failedSteps()
    {
        return this._failedSteps;
    }
    get startTime()
    {
        return this._startTime;
    }
    get endTime()
    {
        return this._endTime;
    }
    get screenshotFolder()
    {
        return this._screenshotFolder;
    }
    set failureMessage(message)
    {
        this._failureMessage = message;
    }
    set state(state)
    {
        this._state = state;
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
        this._steps.push(
            {
                timestamp,
                description,
                state
            }
        );
    }

    /**
     * Increments the amount of passed steps.
     * @method incrementPassedStepAmount
     */
    incrementPassedStepAmount()
    {
        this._passedSteps++;
    }
    /**
     * Increments the amount of failed steps.
     * @method incrementFailedStepsAmount
     */
    incrementFailedStepAmount()
    {
        this._failedSteps++;
    }

    /**
     * Calculates the timestamp of the test-cases initialization.
     * @method calculateStartTime
     */
    calculateStartTime()
    {
        this._startTime = new Date().getTime();
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
        this._endTime = this.steps[this.steps.length - 1].timestamp
    }

    /**
     * Starts the current test-case.
     * @method startTest
     * @param { function } callback 
     */
    startTest(callback)
    {
        const caseTitle = this.case.title;

        this.calculateStartTime();

        const terminal = new TerminalOutput();
        terminal.title = caseTitle;
        terminal.createTable();
        terminal.showTable();

        puppeteer.launch({
            headless: process.env.HEADLESS_BROWSER === "true" ? true : false,
            slowMo: process.env.HEADLESS_DELAY,
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
                const currentStep = this.case.nextQueueItem;

                if (currentStep.getData('delay'))
                {
                    await page.waitFor(currentStep.getData('delay'));
                }

                switch (currentStep.getData('type'))
                {
                    case 'visit':
                        await page.goto(currentStep.getData('url')).then(() =>
                        {
                            currentStep.state = true;
                        }).catch((e) =>
                        {
                            currentStep.state = false;

                            this.failureMessage = currentStep.errorMessage ? `Step ${ terminal.counter + 1 }: ${ currentStep.errorMessage }` : e;
                        });
                        break;
                    case 'fill':
                        await page.type(currentStep.getData('target'), currentStep.getData('content')).then(() =>
                        {
                            currentStep.state = true;
                        }).catch((e) =>
                        {
                            currentStep.state = false;

                            this.failureMessage = currentStep.errorMessage ? `Step ${ terminal.counter + 1 }: ${ currentStep.errorMessage }` : e;
                        });
                        break;
                    case 'click':
                        await page.click(currentStep.getData('target')).then(() =>
                        {
                            currentStep.state = true;
                        }).catch((e) =>
                        {
                            currentStep.state = false;

                            this.failureMessage = currentStep.errorMessage ? `Step ${ terminal.counter + 1 }: ${ currentStep.errorMessage }` : e;
                        });
                        break;
                    case 'press':
                        await page.keyboard.press(currentStep.getData('key')).then(() =>
                        {
                            currentStep.state = true;
                        }).catch((e) =>
                        {
                            currentStep.state = false;

                            this.failureMessage = currentStep.errorMessage ? `Step ${ terminal.counter + 1 }: ${ currentStep.errorMessage }` : e;
                        });
                        break;
                    // case 'compare':
                        
                        // const post = await page.evaluate(id => {
                        //     return document.querySelector(`#post-${id}`) ? true : false
                        // }, id);
                        
                        // expect(post).toEqual(true);
                        // break;
                    case 'console':
                        break;
                    case 'read':
                        break;
                }

                terminal.increaseCounter();
                
                this.setSteps(new Date().getTime(), currentStep.description, currentStep.state);

                terminal.createRow(new Date().getTime(), currentStep.description, currentStep.state);

                if (currentStep.state === false)
                {
                    this.incrementFailedStepAmount();

                    terminal.setBreakpoint();

                    for (let idx = 0; idx <= this.case.queueSize; idx++)
                    {       
                        const currentStep = this.case.nextQueueItem;

                        terminal.increaseCounter();

                        this.incrementFailedStepAmount();

                        this.setSteps(new Date().getTime(), currentStep.description, false);

                        terminal.createRow("", currentStep.description, false);
                    }

                    if (process.env.EMAIL_RESULTS === "true")
                    {
                        await page.waitFor(1000);
                        await page.screenshot({ path: `${ this.screenshotFolder }/screenshot_${ caseTitle.split(" ").join("-").toLowerCase() }_step${ terminal.breakpoint }_error.png`, fullPage: true });
                    }
                    
                    break;
                }
                else
                {
                    if(this.passedSteps === this.stepCounter - 1)
                    {
                        if (process.env.EMAIL_RESULTS === "true")
                        {
                            await page.waitFor(1000);
                            await page.screenshot({ path: `${ this.screenshotFolder }/screenshot_${ caseTitle.split(" ").join("-").toLowerCase() }_step${ terminal.breakpoint }_error.png`, fullPage: true });
                        }
                    }

                    this.incrementPassedStepAmount();
                    this.state = true;
                }
            }

            await browser.close().then(() =>
            {
                this.calculateEndTime();

                terminal.createFooter(this.failedSteps, this.calculateRunningTime());

                callback({
                    caseTitle: this.case.title,
                    time: {
                        start: this.startTime,
                        end: this.endTime,
                        running: this.calculateRunningTime()
                    },
                    state: this.state,
                    steps: this.steps,
                    amount: {
                        passed: this.passedSteps,
                        failed: this.failedSteps
                    },
                    failureMessage: this.failureMessage
                });
            });
        });
    }
}

module.exports = { Test };
