# azmodan

An end-to-end testing framework driven by puppeteer and the magic of yaml.

## Overview

The application runs a set of steps for different cases, defined by yaml files.

## Usage

### Creating a case

the following is a step by step description of the creating of the example files supplied with the application.

1.) Create a directory (``cases`` by default) in the application root#

2.) Create a file called google.yaml

3.) fill it with the following content: 

```
title: 'google search'
steps:
  - type: 'visit'
    url: 'https://www.google.com/'
    title: 'open google.com'

  - type: 'fill'
    target: 'input[name=q]'
    content: 'Hello world'
    title: 'type "Hello world" into searchbar'
    delay: 5000
    
  - type: 'press'
    key: 'Enter'
    title: 'press enter'
```

this will give the case the title "google search", and give the case the following steps:
- visit the url "https://www.google.com/".
- type "Hello world" into the google search bar.
- wait 5 seconds
- press enter

### Running the application

type ```npm start``` after you have defined one or more cases.

## Possible types of steps

### ``visit``

Visits a URL, this is needed for any other steps to follow.

**Options**

| Title       | Type     | required | Description                                     | Example                             |
| ----------- | -------- | -------- | ----------------------------------------------- | ----------------------------------- |
| url         | `string` | true     | The target URL.                                 | https://www.google.com/             |
| description | `string` | false    | A short description of the step.                | open google.com                     |
| error       | `string` | false    | Error message shown on failure.                 | could not find domain google.com.   |
| delay       | `number` | false    | Delay in milliseconds before step is invoked.   | 5000                                |

### ``fill``

Fills in an input field.

**Options**

| Title       | Type     | required | Description                                     | Example                             |
| ----------- | -------- | -------- | ----------------------------------------------- | ----------------------------------- |
| target      | `string` | true     | The target dom-element.                         | input[name=q]                       |
| content     | `string` | true     | The content to be filled into the input field.  | Hello world                         |
| description | `string` | false    | A short description of the step.                | type "Hello world" into searchbar   |
| error       | `string` | false    | Error message shown on failure.                 | could not populate searchbar.       |
| delay       | `number` | string   | Delay in milliseconds before step is invoked.   | 5000                                |

### ``click``

Clicks on a specified dom-element.

**Options**

| Title       | Type     | required | Description                                     | Example                             |
| ----------- | -------- | -------- | ----------------------------------------------- | ----------------------------------- |
| target      | `string` | true     | The target dom-element.                         | #login                              |
| description | `string` | false    | A short description of the step.                | click on login button               |
| error       | `string` | false    | Error message shown on failure.                 | could not click on button "login".  |
| delay       | `number` | string   | Delay in milliseconds before step is invoked.   | 5000                                |

### ``press``

Presses a key.

**Options**

| Title       | Type     | required | Description                                     | Example                             |
| ----------- | -------- | -------- | ----------------------------------------------- | ----------------------------------- |
| key         | `string` | true     | The target dom-element.                         | Enter                               |
| description | `string` | true     | A short description of the step.                | press Enter                         |
| error       | `string` | false    | Error message shown on failure.                 | could not click button "Enter".     |
| delay       | `number` | string   | Delay in milliseconds before step is invoked.   | 5000                                |

### ``console``

Reads out the console.

[MISSING]

### ``read``

Checks a mailbox for mails with a predefined subject.

[MISSING]

## Results

after all tests have finished, the application will show an overview of the results in the terminal and send an email to specified recievers. If a test failed, the email will have a screenshot attached, taken on the cases target, at the position the test canceled.

## .env file

| Property               | Type      | Description                                                           |
| ---------------------- | --------- | --------------------------------------------------------------------- |
| EMAIL_SENDING_USER     | `string`  | The user sending the results-email.                                   |
| EMAIL_SENDING_PASSWORD | `string`  | The password of the user sending results email.                       |
| EMAIL_SENDING_SERVER   | `string`  | The server of the user sending the results email.                     |
| EMAIL_SENDING_PORT     | `number`  | The port of the server sending the results email.                     |
| EMAIL_SENDING_TARGET   | `array`   | One or more targets that will recieve the results email.              |
| CASE_FOLDER            | `string`  | The folder where the test-cases are located. [DEFAULT: 'cases']       |
| SCREENSHOTS_FOLDER     | `string`  | The folder where the test-cases are located. [DEFAULT: 'screenshots'] |
| HEADLESS_BROWSER       | `boolean` | Should the browser be headless or not?                                |
| HEADLESS_DELAY=50      | `number`  | Delay of typing.                                                      |
| EMAIL_RESULTS=false    | `boolean` | Should an email be sent with the results after application finishes?  |
| REPEAT_TEST=false      | `boolean` | Should all test-cases repeat X amount of times?                       |
| REPEAT_AMOUNT=2        | `number`  | Amount of times the test-cases should repeat.                         |

## Dependencies
- cli-color (1.4.0)   - Displays state-colors in terminal.
- dotenv (8.1.0)      - Reads environment configuration.
- imap-simple (4.3.0) - Checks for recieving emails.
- js-yaml (3.13.1)    - Reads yaml files.
- nodemailer (6.3.0)  - Sends outgoing emails.
- puppeteer (1.19.0)  - Controls website remotely.
- tabletops (0.1.4)   - Displays a table in terminal.
