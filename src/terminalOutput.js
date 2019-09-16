'use strict';

const CliTable = require('tabletops');
const color = require("cli-color");

const {
    formatDate,
    verifyDate
} = require('./utils');
    
class TerminalOutput
{
    /**
     * @constructor
     * @param { object } data
     */
    constructor()
    {
        this.table = new CliTable();
        this.counter = 0;
        this.breakpoint = 0;
        this.title;
        this.columns = [
            {
                key: 'id',
                title: ' #',
                width: 4
            },
            {
                key: 'date',
                title: 'Date',
                width: 21
            },
            {
                key: 'description',
                title: 'Action',
                width: 45
            },
            {
                key: 'state',
                title: 'State',
                width: 0
            }
        ];
    }

    /**
     * Gets the title of the table-header.
     * @method getTitle
     * @returns { string }
     */
    getTitle()
    {
        return this.title;
    }

    /**
     * Gets the columns of the table.
     * @method getColumns
     * @returns { object }
     */
    getColumns()
    {
        return this.columns;
    }

    /**
     * Gets the current count of the row counter.
     * @method getCounter
     * @returns { number }
     */
    getCounter()
    {
        return this.counter;
    }

    /**
     * Gets the current cases breakpoint on failed.
     * @method getBreakpoint
     * @returns { number }
     */
    getBreakpoint()
    {
        return this.breakpoint;
    }

    /**
     * Sets the title for the table header.
     * @method setTitle
     * @param { string } titlex
     */
    setTitle(title)
    {
        this.title = title;
    }

    /**
     * Sets the current row line to the breakpoint on fail.
     * @method setBreakpoint
     */
    setBreakpoint()
    {
        this.breakpoint = this.counter;
    }

    /**
     * Increases the row counter of the table.
     * @method increaseCounter
     */
    increaseCounter()
    {
        this.counter += 1;
    }

    /**
     * Creates a new table.
     * @method createTable
     */
    createTable()
    {
        this.table.SetTableTitle(`Testing case "${ this.getTitle() }"`);
        this.table.SetTableColumns(this.getColumns());
    }

    /**
     * Shows the current table in the terminal.
     * @method ShowTable
     */
    showTable()
    {
        this.table.ShowTable();
    }

    /**
     * Creates the footer of the current table.
     * @method createFooter
     */
    createFooter(failedActions, runTime)
    {
        this.table.AddTableFooter(
            failedActions > 0 ? `canceled after ${ runTime } second(s) at #${ this.getBreakpoint() }` : `finished succesfully after ${ runTime } second(s)`
        );
    }
    
    /**
     * Creates a row for the current table.
     * @method createRow
     * @param { number } timestamp
     * @param { string } description
     * @param { boolean } state
     */
    createRow(timestamp, description, state)
    {
        this.table.AddTableRow({
            id: this.getCounter() < 10 ? " " + this.getCounter() : this.getCounter(),
            date: verifyDate(timestamp) ? formatDate(timestamp) : '',
            description,
            state: state === true ? color.green("✔") : color.red("✗")
        });
    }
}

module.exports = { TerminalOutput };
