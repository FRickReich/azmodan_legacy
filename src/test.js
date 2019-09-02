'use strict';

const puppeteer = require('puppeteer');

const { handleTimeDifference } = require('./utils');

class Test
{
    /* ================ CONSTRUCTOR ================ */
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
        this.failureMessage = "abcdefg";
    }

    /* ================== GETTERS ================== */
    /**
     * Gets the timestamp of the current tests initiation.
     * @function getStartTime
     * @returns { number }
     */
    getStartTime()
    {
        return this.startTime;
    }

    /**
     * Gets the timestamp of when the current test-case finished.
     * @function getEndTime
     * @returns { number }
     */
    getEndTime()
    {
        return this.endTime;
    }

    /**
     * Gets the final state of the current test-case.
     * @function getState
     * @returns { boolean }
     */
    getState()
    {
        return this.state;
    }

    /**
     * Gets a list of all actions that are part of the current test-case.
     * @function getActions
     * @returns { object }
     */
    getActions()
    {
        return this.actions;
    }

    /**
     * ON FAILED: Gets the failure message of the current test-case.
     * @function getFailureMessage
     * @returns { string }
     */
    getFailureMessage()
    {
        return this.failureMessage;
    }

    /* ================== SETTERS ================== */
    /**
     * Sets the final state of the current test-case.
     * @function setState
     * @param { bool } state 
     */
    setState(state)
    {
        this.state = state;
    }

    /**
     * Sets the actions taken in the current test-case.
     * @function setActions
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
     * @function setFailureMessage
     * @param { string } message
     */
    setFailureMessage(message)
    {
        this.failureMessage = message;
    }

    /* ================= FUNCTIONS ================= */
    /**
     * Calculates the timestamp of the test-cases initialization.
     * @function calculateStartTime
     */
    calculateStartTime()
    {
        this.startTime = new Date().getTime();
    }

    /**
     * Calculates the timestamp of when the current test-case finished.
     * @function calculateEndTime
     */
    calculateEndTime()
    {
        this.endTime = this.actions[this.actions.length - 1].timestamp
    }

    /**
     * Starts the current test-case.
     * @function startTest
     * @param { function } callback 
     */
    startTest(callback)
    {
        this.calculateStartTime();

        console.log(this.case.title);

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
                        });
                        break;
                    case 'fill':
                        await page.type(currentAction.getData('target'), currentAction.getData('content')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);
                        });
                        break;
                    case 'click':
                        await page.click(currentAction.getData('target')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);
                        });
                        break;
                    case 'press':
                        await page.keyboard.press(currentAction.getData('key')).then(() =>
                        {
                            currentAction.setState(true);
                        }).catch((e) =>
                        {
                            currentAction.setState(false);
                        });
                        break;
                    case 'console':
                        break;
                    case 'read':
                        break;
                }

                this.setActions(new Date().getTime(), currentAction.getTitle(), currentAction.getState());

                console.log("- " + currentAction.getTitle());

                if (currentAction.getState() === false)
                {
                    for (let idx = 0; idx <= this.case.queue.getSize(); idx++)
                    {
                        const currentAction = this.case.queue.getNextItem();

                        this.setActions(new Date().getTime(), currentAction.getTitle(), false);

                        console.log("-------- " + currentAction.getTitle());
                    }

                    await page.waitFor(1000);
                    await page.screenshot({ path: `screenshots/screenshot_${ this.case.getTitle() }_${ index }_${ new Date().getTime() }.png`, fullPage: true });

                    break;
                }
                else
                {
                    this.setState(true);
                }
            }

            await browser.close().then(() =>
            {
                this.calculateEndTime();

                callback({
                    startTime: this.getStartTime(),
                    endTime: this.getEndTime(),
                    runningTime: handleTimeDifference(this.startTime, this.actions[this.actions.length - 1].timestamp),
                    state: this.getState(),
                    actions: this.getActions(),
                    failureMessage: this.getFailureMessage()
                });
            });
        });
    }
}

module.exports = { Test };
