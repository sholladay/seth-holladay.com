#!/usr/bin/env node

// TODO: Use port-drop when it becomes viable.
// https://github.com/hapijs/hapi/issues/3204

// Fail fast if a rejected promise is not caught.
import path from 'node:path';
import 'throw-rejects/register.js';
import chalk from 'chalk';
import envy from 'envy';
import handleQuit from 'handle-quit';
import meow from 'meow';
import open from 'open';
import rootCheck from 'root-check';
import server from './index.js';

const { bold } = chalk;
const cli = meow(`
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
`, {
    importMeta : import.meta
});

const serverOption = {
    ...envy(path.join(import.meta.dirname, '.env')),
    ...cli.flags
};
delete serverOption.open;

const app = await server(serverOption);
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
