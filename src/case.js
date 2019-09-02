'use strict';

require('dotenv').config();

const {
    readYamlFile
} = require('./utils');
const { Queue } = require('./queue');

class Case
{
    /* ================ CONSTRUCTOR ================ */
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

    /* ================== GETTERS ================== */
    /**
     * Gets the title of the current case.
     * @function getTitle
     * @returns { string }
     */
    getTitle()
    {
        return this.title;
    }

    /* ================== SETTERS ================== */
    /** 
     * Sets the title of the current case.
     * @param { string } input
     */
    setTitle(input)
    {
        this.title = input;
    }

    /**
     * Populates the cases queue with all actions from the list.
     * @param { array } actions
     */
    setQueue(actions)
    {
        actions.forEach(item =>
        {
            this.queue.setNewItem(item);
        });
    }
    
    /* ================= FUNCTIONS ================= */
    
}

module.exports = { Case };
