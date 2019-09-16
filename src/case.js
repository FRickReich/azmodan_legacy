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
        const caseData = readYamlFile(`./${process.env.CASE_FOLDER}`, data);

        this.title = "";
        this.queue = new Queue();

        this.setTitle(caseData.title);
        this.setQueue(caseData.actions);
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
     * Sets the title of the current case.
     * @method setTitle
     * @param { string } input
     */
    setTitle(input)
    {
        this.title = input;
    }

    /**
     * Populates the cases queue with all actions from the list.
     * @method setQueue
     * @param { array } actions
     */
    setQueue(actions)
    {
        actions.forEach(item =>
        {
            this.queue.setNewItem(item);
        });
    }
}

module.exports = { Case };
