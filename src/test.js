'use strict';

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
        this.actionCounter = caseData.queue.getSize();
        this.startTime;
        this.endTime;
        this.state = false;
        this.actions = [];
        this.passedActions = 0;
        this.failedActions = 0;
        this.failureMessage = '';
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
     * Gets a list of all actions that are part of the current test-case.
     * @method getActions
     * @returns { object }
     */
    getActions()
    {
        return this.actions;
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
     * Gets the amount of passed actions.
     * @method getPassedActionsAmount
     * @returns { number }
     */
    getPassedActionsAmount()
    {
        return this.passedActions;    
    }

    /**
     * Gets the amount of failed actions.
     * @method getFailedActionsAmount
     * @returns { number }
     */
    getFailedActionsAmount()
    {
        return this.failedActions;
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
     * Sets the actions taken in the current test-case.
     * @method setActions
     * @param { number } timestamp
     * @param { string } description
     * @param { bool } state
     */
    setActions(timestamp, description, state)
    {
        this.actions.push(
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
     * Increments the amount of passed actions.
     * @method incrementPassedActionAmount
     */
    incrementPassedActionAmount()
    {
        this.passedActions++;
    }
    /**
     * Increments the amount of failed actions.
     * @method incrementFailedActionAmount
     */
    incrementFailedActionAmount()
    {
        this.failedActions++;
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
        return handleTimeDifference(this.startTime, this.actions[this.actions.length - 1].timestamp);
    }

    /**
     * Calculates the timestamp of when the current test-case finished.
     * @method calculateEndTime
     */
    calculateEndTime()
    {
        this.endTime = this.actions[this.actions.length - 1].timestamp
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

            for (let index = 0; index < this.actionCounter; index++)
            {
                const currentAction = this.case.queue.getNextItem();

                if (currentAction.getData('delay'))
                {
                    await page.waitFor(currentAction.getData('delay'));
                }

                switch (currentAction.getData('type'))
                {
                    case 'visit':
                        await page.goto(currentAction.getData('url')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);

                            this.setFailureMessage(currentAction.getErrorMessage() ? currentAction.getErrorMessage() : e);
                        });
                        break;
                    case 'fill':
                        await page.type(currentAction.getData('target'), currentAction.getData('content')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);

                            this.setFailureMessage(currentAction.getErrorMessage() ? currentAction.getErrorMessage() : e);
                        });
                        break;
                    case 'click':
                        await page.click(currentAction.getData('target')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);

                            this.setFailureMessage(currentAction.getErrorMessage() ? currentAction.getErrorMessage() : e);
                        });
                        break;
                    case 'press':
                        await page.keyboard.press(currentAction.getData('key')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);

                            this.setFailureMessage(currentAction.getErrorMessage() ? currentAction.getErrorMessage() : e);
                        });
                        break;
                    case 'console':
                        break;
                    case 'read':
                        break;
                }

                terminal.increaseCounter();
                
                this.setActions(new Date().getTime(), currentAction.getDescription(), currentAction.getState());

                terminal.createRow(new Date().getTime(), currentAction.getDescription(), currentAction.getState());

                if (currentAction.getState() === false)
                {
                    this.incrementFailedActionAmount();

                    terminal.setBreakpoint();

                    for (let idx = 0; idx <= this.case.queue.getSize(); idx++)
                    {       
                        const currentAction = this.case.queue.getNextItem();

                        terminal.increaseCounter();

                        this.incrementFailedActionAmount();

                        this.setActions(new Date().getTime(), currentAction.getDescription(), false);

                        terminal.createRow("", currentAction.getDescription(), false);
                    }

                    await page.waitFor(1000);
                    await page.screenshot({ path: `screenshots/screenshot_${ caseTitle }_${ index }_${ new Date().getTime() }.png`, fullPage: true });

                    break;
                }
                else
                {
                    this.incrementPassedActionAmount();
                    this.setState(true);
                }
            }

            await browser.close().then(() =>
            {
                this.calculateEndTime();

                terminal.createFooter(this.getFailedActionsAmount(), this.calculateRunningTime());

                callback({
                    caseTitle: this.case.getTitle(),
                    time: {
                        start: this.getStartTime(),
                        end: this.getEndTime(),
                        running: this.calculateRunningTime(),
                    },
                    state: this.getState(),
                    actions: this.getActions(),
                    amount: {
                        passed: this.getPassedActionsAmount(),
                        failed: this.getFailedActionsAmount()
                    },
                    failureMessage: this.getFailureMessage()
                });
            });
        });
    }
}

module.exports = { Test };
