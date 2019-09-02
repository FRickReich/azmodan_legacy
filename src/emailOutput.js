'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

const { getFilesInDirectory, clearDirectory, formatDateToday, showStep, generateHtmlOutput } = require('./utils');

class EmailOutput
{
    /* ================ CONSTRUCTOR ================ */
    /**
     * @constructor
     * @param { object } data
     */
    constructor(results)
    {
        this.results = results;
        this.currentDate = new Date();
        this.screenshots = [];
        this.screenshotDirectory = './screenshots'

        this.sendMail();
    }

    /* ================== GETTERS ================== */
    

    /* ================== SETTERS ================== */
    

    /* ================= FUNCTIONS ================= */
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

            fs.readdir('./screenshots', (err, files) => 
            {
                if (err) throw err;

                for (const file of files) 
                {
                    fs.unlink(path.join('./screenshots', file), err => 
                    {
                        if (err) throw err;
                    });
                }
            });
        });
    }
}

module.exports = { EmailOutput };
