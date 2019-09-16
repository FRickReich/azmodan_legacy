'use strict';

const {
    formatDateToday,
    formatDate,
    verifyDate
} = require('./time');

const generateHtmlOutput = (results) =>
{
    const style = `
        html{background-color:#D3DADE;margin:0;padding:0;}
		body,#bodyTable,#bodyCell,#bodyCell{height:100%!important;font-size:12px;margin:0;padding:0;width:100%!important;font-family:Helvetica,Arial,"Lucida Grande",sans-serif;}
		table{border-collapse:collapse;}
		img,a img{border:0;outline:none;text-decoration:none;height:auto;line-height:100%;}
		a{text-decoration:none!important;border-bottom:1px solid;}
		h1,h2,h3,h4,h5,h6{color:#5F5F5F; font-weight:normal; font-family:Helvetica;font-size:20px;line-height:125%;text-align:Left;letter-spacing:normal;margin:0;margin-bottom:10px;padding:0;}
		body, #bodyTable{background-color:#D3DADE;color:#7A7A7A;}
        #emailBody{background-color:#FFFFFF;border:0;}
        #emailHeader{color:#FFFFFF;background-color:#EC6608;}
        #emailFooter{background-color:#3B4A56}
        #emailFooter #footerImage{text-align:center;}
        table.tableComponent{width:100%;border-collapse:collapse;}
        table.tableComponent th{height:30px;text-align:center;vertical-align:center;background-color:#555;color:white;}
        table.tableComponent td{padding:5px;}
        .tableComponent tr:nth-child(odd){background-color:#eee;}
        .textContent h1{color:#FFFFFF;line-height:100%;font-family:Helvetica,Arial,sans-serif;font-size:35px;font-weight:normal;margin-bottom:5px;text-align:center;}
        .textContent #headerInfo{text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;color:#FFFFFF;line-height:135%;}
        .success{color:#3AA57B;}
        .failure{color:#DD2515;}
        .breakpoint{color:#DD2515;}
    `

    return (`
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="format-detection" content="telephone=no" />
        <title>testresults</title>
        <style type="text/css">
            ${style }
        </style>
    </head>
    <body>
        <center>
            <table id="bodyTable" cellpadding="0" cellspacing="0" height="100%" width="100%">
                <tr>
                    <td id="bodyCell" align="center" valign="top" >

                        <table id="emailBody" border="0" cellpadding="0" cellspacing="0" width="700">

                            <!-- HEADER -->
                            <tr>
                                <td align="center" valign="top">
                                    <table id="emailHeader" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">

                                                <table border="0" cellpadding="0" cellspacing="0" width="700">
                                                    <tr>
                                                        <td align="center" valign="top" width="700">

                                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td class="textContent" align="center" valign="top">
                                                                        <h1>
                                                                            e2e Test Results
                                                                        </h1>
                                                                        <div id="headerInfo">
                                                                            <p>These are the results for the test on ${ formatDateToday(new Date()) }.</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- CASES -->

                            ${
                                results.map(result =>
                                {
                                    return `
                                    <tr>
                                        <td align="center" valign="top">
                                            <!-- CENTERING TABLE // -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="700">
                                                            <tr>
                                                                <td align="center" valign="top" width="700">
                                                                    <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top">

                                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                                    <tr>
                                                                                        <td valign="top" class="textContent">
                                                                                            <h2>${ result.caseTitle }</h2>

                                                                                            <div>
                                                                                            Test finished after ${ result.time.running } ${ result.time.running === 1 ? 'second' : 'seconds' }
                                                                                            </div>

                                                                                            <br/>

                                                                                            <h3>
                                                                                                Actions
                                                                                            </h3>

                                                                                            <table class="tableComponent">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th width="30%">Date</th>
                                                                                                        <th width="55%">Action</th>
                                                                                                        <th width="15%">State</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                ${
                                                                                                    result.actions.map(action =>
                                                                                                    {
                                                                                                        return `
                                                                                                            <tr>
                                                                                                                <td>${ verifyDate(action.timestamp) ? formatDate(action.timestamp) : '' }</td>
                                                                                                                <td>${ action.description || action.type }</td>
                                                                                                                <td class="${ action.state === true ? 'success' : 'failure' }"">${ action.state === true ? '✔' : '✘' }</td>
                                                                                                            </tr>
                                                                                                        `
                                                                                                    })
                                                                                                    .join('')
                                                                                                }
                                                                                                </tbody>
                                                                                            </table>

                                                                                            <br/>
                                                                                            <h3>
                                                                                                Results
                                                                                            </h3>
                                                                                            <div>

                                                                                                <ul class="resultlist">
                                                                                                    <li style="color: #3AA57B">${ result.amount.passed } Passed</li>
                                                                                                    <li style="color: #DD2515">${ result.amount.failed } Failed</li>
                                                                                                </ul>

                                                                                            </div>

                                                                                            ${
                                                                                                result.failureMessage ?
                                                                                                    `
                                                                                                    <h3>
                                                                                                        Breakpoint
                                                                                                    </h3>
                                                                                                    <div class="breakpoint">
                                                                                                        ${ result.failureMessage }
                                                                                                    </div>`
                                                                                                :
                                                                                                    ''
                                                                                                }
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    `;
                                })
                                .join('')
                            }

                            <!-- FOOTER -->
                            <tr>
                                <td align="center" valign="top">
                                    <!-- CENTERING TABLE // -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">
                                                <table id="emailFooter" border="0" cellpadding="0" cellspacing="0" width="700">
                                                    <tr>
                                                        <td align="center" valign="top" width="700">
                                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" valign="top">´
                                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                            <tr>
                                                                                <td valign="top" class="textContent">
                                                                                    <div id="footerImage">
                                                                                       <img src="https://www.opuscapita.com/images/logo_white.png"/>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    `);
}

module.exports.generateHtmlOutput = generateHtmlOutput;
