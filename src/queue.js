'use strict';

const { Step } = require('./step');

class Queue
{
    /**
     * @constructor 
     */
    constructor()
    {
        this._first = null;
        this._size = 0;
    }

    get nextItem()
    {
        const temp = this._first;

        this._first = this._first._next;
        this._size -= 1;

        return temp;
    }
    get size()
    {
        return this._size;
    }

    set size(size)
    {
        this._size = size;
    }
    set newItem(data)
    {
        const step = new Step(data);

        if (!this._first)
        {
            this._first = step;
        }
        else
        {
            let n = this._first;

            while (n._next)
            {
                n = n._next;
            }

            n._next = step;
        }

        this._size += 1;
        return step;
    }
}

module.exports = { Queue };
