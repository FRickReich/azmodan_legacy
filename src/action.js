'use strict';

class Action
{
    /* ================ CONSTRUCTOR ================ */
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

    /* ================== GETTERS ================== */
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
     * Gets the title of the current action.
     * @method getTitle
     * @returns { string }
     */
    getTitle()
    {
        return this.data.title;
    }

    /* ================== SETTERS ================== */
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
