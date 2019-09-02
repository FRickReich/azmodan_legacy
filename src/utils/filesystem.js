'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Gets all filenames in a specified directory.
 * @function directory
 * @param { string } directory
 * @returns { array } 
 */
const getFilesInDirectory = (directory) =>
{
    return fs.readdirSync(`./${ directory }`);
}

/**
 * Deletes all files in a specified directory.
 * @function clearDirectory
 * @param { string } directory 
 */
const clearDirectory = (directory) =>
{
    fs.readdir(directory, (err, files) =>
    {
        if (err) throw err;
      
        for (const file of files) 
        {
            fs.unlink(path.join(directory, file), err => 
            {
                if (err) throw err;
            });
        }
    });
}

/**
 * Reads a YAML file and returns its content.
 * @function readYamlFile
 * @param { string } directory 
 * @param { string } filename 
 * @returns { object }
 */
const readYamlFile = (directory, filename) =>
{
    return yaml.safeLoad(fs.readFileSync(`./${ directory }/${ filename }`, 'utf8'));
}

module.exports.getFilesInDirectory = getFilesInDirectory;
module.exports.clearDirectory = clearDirectory;
module.exports.readYamlFile = readYamlFile;
