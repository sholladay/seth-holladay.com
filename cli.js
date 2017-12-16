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
      $ seth-holladay.com

    Option
      --port        Port number to listen on for HTTPS requests
      --open        Open the homepage in your browser
      --open=<url>  Open a specific page in your browser

    Example
      $ seth-holladay.com
      ${bold.cyan('Seth ready')} ${bold.grey('at')} ${bold.yellow('https://localhost/')}
      $ seth-holladay.com --port=7000
      ${bold.cyan('Seth ready')} ${bold.grey('at')} ${bold.yellow('https://localhost:7000/')}
`);

const server = require('.');

const serverOption = {
    ...envy(path.join(__dirname, '.env')),
    ...cli.flags
};
delete serverOption.open;

server(serverOption).then(async (app) => {
    handleQuit(() => {
        app.stop();
    });

    await app.start();

    // Attempt to set UID to a normal user now that we definitely
    // do not need elevated privileges.
    rootCheck();

    console.log(
        bold.cyan('Seth ready'),
        bold.grey('at'),
        bold.yellow(app.info.uri)
    );

    const page = cli.flags.open;
    if (page) {
        open(app.info.uri + '/' + (page === true ? '' : page));
    }
});
