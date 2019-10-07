'use strict';

require('dotenv').config();

const { Queue } = require('./queue');
const {
    readYamlFile
} = require('./utils');

class Case
{
    /**
     * @constructor
     * @param { object } data
     */
    constructor(data)
    {
        const caseData = readYamlFile(process.env.CASE_FOLDER ? `./${ process.env.CASE_FOLDER }` : './cases', data);

        this.title = "";
        this.queue = new Queue();

        this.setTitle(caseData.title);
        this.setQueue(caseData.steps);
    }

    /**
     * Gets the title of the current case.
     * @method getTitle
     * @returns { string }
     */
    getTitle()
    {
        return this.title;
    }

    /**
     * Gets all steps in the queue.
     * @method getQueue
     * @returns { object }
     */
    getQueue()
    {
        return this.queue;
    }

    /**
     * Gets the size of the current queue.
     * @method getQueueSize
     * @returns { number }
     */
    getQueueSize()
    {
        return this.queue.getSize();
    }

    /**
     * Gets the next item in the current queue.
     * @method getNextItemInQueue
     * @returns { object }
     */
    getNextItemInQueue()
    {
        return this.queue.getNextItem();
    }

    /** 
     * Sets the title of the current case.
     * @method setTitle
     * @param { string } input
     */
    setTitle(input)
    {
        this.title = input;
    }

    /**
     * Populates cases queue with all steps from the list.
     * @method setQueue
     * @param { array } steps
     */
    setQueue(steps)
    {
        steps.forEach(item =>
        {
            this.queue.setNewItem(item);
        });
    }
}

module.exports = { Case };
