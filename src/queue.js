'use strict';

const { Step } = require('./step');

class Queue
{
    /**
     * @constructor 
     */
    constructor()
    {
        this.first = null;
        this.size = 0;
    }

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

    /**
     * Add an item (step) to the queue.
     * @method setNewItem
     * @param { object } data
     * @returns { object }
     */
    setNewItem(data)
    {
        const step = new Step(data);

        if (!this.first)
        {
            this.first = step;
        }
        else
        {
            let n = this.first;

            while (n.next)
            {
                n = n.next;
            }

            n.next = step;
        }

        this.size += 1;
        return step;
    }
}

module.exports = { Queue };
