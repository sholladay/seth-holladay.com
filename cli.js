#!/usr/bin/env node

// TODO: Use port-drop when it becomes viable.
// https://github.com/hapijs/hapi/issues/3204

'use strict';

// Fail fast if a rejected promise is not caught.
require('throw-rejects')();

const path = require('path');
const { bold } = require('chalk');
const open = require('opn');
const rootCheck = require('root-check');
const handleQuit = require('handle-quit');
const envy = require('envy');
const cli = require('meow')(`
    Usage
      $ holladay

    Option
      --port        Port number to listen on for HTTPS requests
      --open        Open the homepage in your browser
      --open=<url>  Open a specific page in your browser

    Example
      $ holladay
      ${bold.cyan('Seth ready')} ${bold.grey('at')} ${bold.yellow('https://localhost/')}
      $ holladay --port=7000
      ${bold.cyan('Seth ready')} ${bold.grey('at')} ${bold.yellow('https://localhost:7000/')}
`);

const AppServer = require('.');

console.log('env:', process.env);

const serverOption = {
    ...envy(path.join(__dirname, '.env')),
    ...cli.flags
};
delete serverOption.open;

const server = new AppServer(serverOption);

handleQuit(() => {
    server.stop();
});

server.start().then(() => {
    // Attempt to set UID to a normal user now that we definitely
    // do not need elevated privileges.
    rootCheck();

    console.log(
        bold.cyan('Seth ready'),
        bold.grey('at'),
        bold.yellow(server.info.uri)
    );

    const page = cli.flags.open;
    if (page) {
        open(server.info.uri + '/' + (page === true ? '' : page));
    }
});
