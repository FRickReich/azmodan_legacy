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
                title: 'Step',
                width: 45
            },
            {
                key: 'state',
                title: 'State',
                width: 0
            }
        ];
        
        this._counter = 0;
        this._title;
        this._breakpoint = 0;
    }

    get counter()
    {
        return this._counter;
    }
    get title()
    {
        return this._title;
    }
    get breakpoint()
    {
        return this._breakpoint;
    }
    set title(title)
    {
        this._title = title;
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
     * Sets the current row line to the breakpoint on fail.
     * @method setBreakpoint
     */
    setBreakpoint()
    {
        this._breakpoint = this.counter;
    }

    /**
     * Increases the row counter of the table.
     * @method increaseCounter
     */
    increaseCounter()
    {
        this._counter += 1;
    }

    /**
     * Creates a new table.
     * @method createTable
     */
    createTable()
    {
        this.table.SetTableTitle(`Testing case "${ this.title }"`);
        this.table.SetTableColumns(this.columns);
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
    createFooter(failedSteps, runTime)
    {
        this.table.AddTableFooter(
            failedSteps > 0 ? `canceled after ${ runTime } second(s) at #${ this.breakpoint }` : `finished succesfully after ${ runTime } second(s)`
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
            id: this.counter < 10 ? " " + this.counter : this.counter,
            date: verifyDate(timestamp) ? formatDate(timestamp) : '',
            description,
            state: state === true ? color.green("✔") : color.red("✗")
        });
    }
}

module.exports = { TerminalOutput };
