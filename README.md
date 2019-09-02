# azmodan

An end-to-end testing framework driven by puppeteer and the magic of yaml.

## Overview
The application runs a set of actions for different cases, defined by yaml files.

## Usage

### Creating a case
the following is a step by step description of the creating of the example files supplied with the application.

1.) Create a directory (``cases`` by default) in the application root#

2.) Create a file called google.yaml

3.) fill it with the following content: 

```
title: 'google search'
actions:
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

this will give the case the title "google search", and give the case the following actions:
- visit the url "https://www.google.com/".
- type "Hello world" into the google search bar.
- wait 5 seconds
- press enter

### Running the application
type ```npm start``` after you have defined one or more cases.

### Possible action types

#### ``visit``
Visits a URL, this is needed for any other steps to follow.

**Options**
| Title       | Type   | required | Description                                     | Example                           |
| ----------- | ------ | -------- | ----------------------------------------------- | --------------------------------- |
| url         | string | true     | The target URL.                                 | https://www.google.com/           |
| description | string | true     | A short description of the action.              | open google.com                   |
| delay       | number | false    | Delay in milliseconds before action is invoked. | 5000                              |

#### ``fill``
Fills in an input field.

**Options**
| Title       | Type   | required | Description                                     | Example                           |
| ----------- | ------ | -------- | ----------------------------------------------- | --------------------------------- |
| target      | string | true     | The target dom-element.                         | input[name=q]                     |
| content     | string | true     | The content to be filled into the input field.  | Hello world                       |
| description | string | true     | A short description of the action.              | type "Hello world" into searchbar |
| delay       | number | string   | Delay in milliseconds before action is invoked. | 5000                              |

**Options**

#### ``click``
Clicks on a specified dom-element.

**Options**
| Title       | Type   | required | Description                                     | Example                           |
| ----------- | ------ | -------- | ----------------------------------------------- | --------------------------------- |
| target      | string | true     | The target dom-element.                         | #login                            |
| description | string | true     | A short description of the action.              | click on login button             |
| delay       | number | string   | Delay in milliseconds before action is invoked. | 5000                              |

#### ``press``
Presses a key.

**Options**
| Title       | Type   | required | Description                                     | Example                           |
| ----------- | ------ | -------- | ----------------------------------------------- | --------------------------------- |
| key         | string | true     | The target dom-element.                         | Enter                             |
| description | string | true     | A short description of the action.              | Press Enter                       |
| delay       | number | string   | Delay in milliseconds before action is invoked. | 5000                              |

#### ``console``
Reads out the console.

#### ``read``
Checks a mailbox for mails with a predefined subject.

### Results

after all tests have finished, the application will show an overview of the results in the terminal and send an email to specified recievers. If a test failed, the email will have a screenshot attached, taken on the cases target, at the position the test canceled.

## Dependencies
- cli-color (1.4.0)   - Displays state-colors in terminal.
- dotenv (8.1.0)      - Reads environment configuration.
- imap-simple (4.3.0) - Checks for recieving emails.
- js-yaml (3.13.1)    - Reads yaml files.
- nodemailer (6.3.0)  - Sends outgoing emails.
- puppeteer (1.19.0)  - Controls website remotely.
- tabletops (0.1.4)   - Displays a table in terminal.
