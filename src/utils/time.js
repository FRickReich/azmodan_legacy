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
 * Returns a formatted date.
 * @function formatDate
 * @param { string } date
 */
const formatDate = function(date)
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

module.exports.handleTimeDifference = handleTimeDifference;
module.exports.formatDate = formatDate;
