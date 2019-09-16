'use strict';

class Action
{
    /**
     * @constructor
     * @param { object } data
     */
    constructor(data)
    {
        this.data = data;
        this.next = null;
        this.state = false;
    }

    /**
     * Gets the state of the current action.
     * @method getState
     * @returns { boolean }
     */
    getState()
    {
        return this.state;
    }

    /**
     * Gets the specified piece of data from the data object.
     * @method getData
     * @param { string } key 
     * @returns { object }
     */
    getData(key)
    {
        return this.data[key];
    }

    /**
     * Gets the error message that was thrown after the current test-case failed.
     * @method getErrorMessage
     * @returns { string }
     */
    getErrorMessage()
    {
        return this.data.error;
    }

    /**
     * Gets the description of the current action.
     * @method getDescription
     * @returns { string }
     */
    getDescription()
    {
        return this.data.description;
    }

    /**
     * Sets state of the current action.
     * @method setState
     * @param { object } state 
     */
    setState(state)
    {
        this.state = state;
    }

    /**
     * Adds a specified piece of data to the data object.
     * @method setData
     * @param { string } key 
     * @param { string } input 
     */
    setData(key, input)
    {
        this.data[key] = input;
    }
}

module.exports = { Action };
