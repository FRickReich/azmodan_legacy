'use strict';

const { Action } = require('./action');

class Queue
{
    /* ================ CONSTRUCTOR ================ */
    /**
     * @constructor 
     */
    constructor()
    {
        this.first = null;
        this.size = 0;
    }

    /* ================== GETTERS ================== */
    /**
     * Gets the next item and removes it from the queue.
     * @method getNextItem
     * @returns { object }
     */
    getNextItem()
    {
        const temp = this.first;

        this.first = this.first.next;
        this.size -= 1;

        return temp;
    }

    /**
     * Gets the current size of the queue.
     * @method getSize
     * @returns { number }
     */
    getSize()
    {
        return this.size;
    }

/* ================== SETTERS ================== */
    /**
     * Add an item (action) to the queue.
     * @method setNewAction
     * @param { object } data
     * @returns { object }
     */
    setNewItem(data)
    {
        const action = new Action(data);

        if (!this.first)
        {
            this.first = action;
        }
        else
        {
            let n = this.first;

            while (n.next)
            {
                n = n.next;
            }

            n.next = action;
        }

        this.size += 1;
        return action;
    }
}

module.exports = { Queue };
