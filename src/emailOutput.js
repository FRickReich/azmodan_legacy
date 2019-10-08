'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');

const {
    getFilesInDirectory,
    clearDirectory,
    formatDateToday,
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
        this.currentDate = new Date();
        this.screenshots = [  ];
        this.screenshotDirectory = process.env.SCREENSHOTS_FOLDER ? `./${ process.env.SCREENSHOTS_FOLDER }` : './screenshots'
        this.mailSettings = [  ];
        
        this._results = results;
        this._attachments = [];

        this.sendMail();
    }

    get attachments()
    {
        return this._attachments;
    }
    get results()
    {
        return this._results;
    }

    /**
     * Gets the mailer settings for transporter and options.
     * @method getMailSettings
     * @returns { object }
     */
    
    getMailSettings(section)
    {
        return this.mailSettings[section];
    }

    /**
     * Sets up a list of screenshots to attach.
     * @method setAttachments
     */
    setAttachments()
    {
        this.screenshots = getFilesInDirectory(this.screenshotDirectory);
        
        this._attachments = this.screenshots.map((file) =>
        {
            return { filename: file, path: this.screenshotDirectory + '/' + file };
        });
    }

    /**
     * Sets up the mailer.
     * @method setMailSettings
     */
    setMailSettings()
    {
        this.mailSettings = 
        {
            transporter:
            {
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
            },
            options:
            {
                from: process.env.EMAIL_SENDING_USER,
                to: process.env.EMAIL_SENDING_TARGET.split(","),
                subject: `Test results for ${ formatDateToday(this.currentDate) }`,
                html: generateHtmlOutput(this.results),
                attachments: this.attachments
            }
        }
    }

    /**
     * Sends the result-email to recipients set in .env file.
     * @method sendMail
     */
    sendMail()
    {
        this.setAttachments();
        this.setMailSettings();

        const transporter = nodemailer.createTransport(this.getMailSettings("transporter"));
        const mailOptions = this.getMailSettings("options");

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
