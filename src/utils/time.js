'use strict';

/**
 * Handles the difference in seconds between two timestamps.
 * @function handleTimeDifference
 * @param { number } time1 
 * @param { number } time2
 * @returns { number }
 */
const handleTimeDifference = (time1, time2) =>
{
    const differenceTime = Math.floor((time2 - time1) / 1000);

    return differenceTime;
}

/**
 * Validates if input is an actual date.
 * @function verifyDate
 * @param { number } timestamp 
 */
const verifyDate = (timestamp) =>
{
    return !isNaN(new Date(timestamp).getTime()) ? true : false
}

/**
 * Returns a formatted date.
 * @function formatDate
 * @param { string } date
 */
const formatDate = (date) =>
{
    return new Date(date).toLocaleString('de-DE',
    {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Formats a date to short format (XX MONTH XXXX).
 * @function formatDateToday
 * @param { object } date 
 */
const formatDateToday = (date) =>
{
    return date.toString().split(' ').splice(1,3).join(' ')    
}

module.exports.handleTimeDifference = handleTimeDifference;
module.exports.formatDate = formatDate;
module.exports.verifyDate = verifyDate;
module.exports.formatDateToday = formatDateToday;
