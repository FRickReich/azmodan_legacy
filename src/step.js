'use strict';

class Step
{
    /**
     * @constructor
     * @param { object } data
     */
    constructor(data)
    {
        this._data = data;
        this._next = null;
        this._state = false;
    }

    get state()
    {
        return this._state;
    }
    get errorMessage()
    {
        return this._data.error;
    }
    get description()
    {
        return this._data.description;
    }
    set state(state)
    {
        this._state = state;
    }

    /**
     * Gets the specified piece of data from the data object.
     * @method getData
     * @param { string } key 
     * @returns { object }
     */
    getData(key)
    {
        return this._data[key];
    }

    /**
     * Adds a specified piece of data to the data object.
     * @method setData
     * @param { string } key 
     * @param { string } input 
     */
    setData(key, input)
    {
        this._data[key] = input;
    }
}

module.exports = { Step };
