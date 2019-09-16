'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');

const {
    getFilesInDirectory,
    clearDirectory,
    formatDateToday,
    showStep,
    generateHtmlOutput
} = require('./utils');

class EmailOutput
{
    /**
     * @constructor
     * @param { object } data
     */
    constructor(results)
    {
        this.results = results;
        this.currentDate = new Date();
        this.screenshots = [];
        this.screenshotDirectory = process.env.SCREENSHOTS_FOLDER ? `./${ process.env.SCREENSHOTS_FOLDER }` : './screenshots'


        

        this.sendMail();
    }

    sendMail()
    {
        this.screenshots = getFilesInDirectory(this.screenshotDirectory);

        showStep(3);

        const attachments = this.screenshots.map((file) =>
        {
            return { filename: file, path: this.screenshotDirectory + '/' + file };
        });

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SENDING_SERVER,
            port: process.env.EMAIL_SENDING_PORT,
            secure: false,
            auth:
            {
                user: process.env.EMAIL_SENDING_USER,
                pass: process.env.EMAIL_SENDING_PASSWORD
            },
            tls:
            {
                ciphers: 'SSLv3'
            },
            requireTLS: true
        });

        const mailOptions =
        {
            from: process.env.EMAIL_SENDING_USER,
            to: process.env.EMAIL_SENDING_TARGET.split(","),
            subject: `Test results for ${ formatDateToday(this.currentDate) }`,
            html: generateHtmlOutput(this.results),
            attachments: attachments
        };

        transporter.sendMail(mailOptions, function (err, info)
        {
            if (err)
            {
                console.log(err);
            }

            clearDirectory('./screenshots');
        });
    }
}

module.exports = { EmailOutput };
