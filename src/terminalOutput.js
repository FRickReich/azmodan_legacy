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
        this.title;
        this.columns = [
            {
                key: 'date',
                title: 'Date',
                width: 21
            },
            {
                key: 'action',
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

    getTitle()
    {
        return this.title;
    }
    
    getColumns()
    {
        return this.columns;
    }

    setTitle(title)
    {
        this.title = title;
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
        this.table.AddTableFooter( failedActions > 0 ? `canceled after ${runTime } second(s) with ${ failedActions } ${ failedActions === 1 ? 'error' : 'errors' }` : `finished succesfully after ${ runTime } second(s)`);
    }
    
    /**
     * Creates a row for the current table.
     * @method createRow
     * @param { number } timestamp 
     * @param { string } action 
     * @param { boolean } state 
     */
    createRow(timestamp, action, state)
    {
        this.table.AddTableRow({ date: verifyDate(timestamp) ? formatDate(timestamp) : '', action, state: state === true ? color.green("✔") : color.red("✗") });
    }
}

module.exports = { TerminalOutput };
