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

        this._title = "";
        this._queue = new Queue();

        this.title = caseData.title;
        this.queue = caseData.steps;
    }

    get title()
    {
        return this._title;
    }
    get queue()
    {
        return this._queue;
    }
    get queueSize()
    {
        return this._queue.size;
    }
    get nextQueueItem()
    {
        return this._queue.nextItem;
    }
    set title(input)
    {
        this._title = input;
    }
    set queue(steps)
    {
        steps.forEach(item =>
        {
            this._queue.newItem = item;
        });
    }
}

module.exports = { Case };
