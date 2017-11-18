'use strict';

const fs = require('fs');
const path = require('path');
const portType = require('port-type');
const joi = require('joi');
const { Server } = require('hapi');
const hi = require('hapi-hi');
const errorPage = require('hapi-error-page');
const alignJson = require('hapi-align-json');
const zebra = require('hapi-zebra');
const inert = require('inert');
const vision = require('vision');
const lout = require('lout');
const handlebars = require('handlebars');

/* eslint-disable global-require */
const routes = [
    require('./lib/route/static'),
    require('./lib/route/home'),
    require('./lib/route/about'),
    require('./lib/route/faq'),
    require('./lib/route/contact'),
    require('./lib/route/donate'),
    require('./lib/route/donate/charge')
];
/* eslint-enable global-require */

class AppServer extends Server {
    constructor(option) {
        const value = joi.attempt(option, {
            port            : joi.number().positive().integer().min(0).max(65535).default(portType.haveRights(443) ? 443 : 3000),
            stripePublicKey : joi.string().required().token().min(25).regex(/^pk_/),
            stripeSecretKey : joi.string().required().token().min(25).regex(/^sk_/)
        });

        const config = {
            tls : !process.env.NOW && {
                /* eslint-disable no-sync */
                key  : fs.readFileSync(path.join(__dirname, 'lib', 'key', 'localhost.key')),
                cert : fs.readFileSync(path.join(__dirname, 'lib', 'cert', 'localhost-chain.cert'))
                /* eslint-enable no-sync */
            },
            ...value
        };

        super({
            debug : {
                log     : ['error'],
                request : ['error']
            },
            connections : {
                routes : {
                    files : {
                        relativeTo : path.join(__dirname, 'lib', 'static')
                    }
                }
            }
        });

        Object.assign(this.app, config);

        super.connection({
            labels : ['web', 'tls'],
            host   : 'localhost',
            port   : config.port,
            tls    : config.tls
        });
    }

    async start() {
        await super.register([
            {
                register : hi,
                options  : {
                    cwd : __dirname
                }
            },
            {
                register : zebra,
                options  : {
                    secretKey : this.app.stripeSecretKey
                }
            },
            inert,
            vision,
            errorPage,
            lout,
            alignJson
        ]);

        // Template rendering configuration using "vision" plugin.
        this.views({
            engines : {
                html : handlebars
            },
            relativeTo   : path.join(__dirname, 'lib', 'view'),
            // Directories for views, helpers, partials, and layouts.
            path         : '.',
            helpersPath  : 'helper',
            partialsPath : 'partial',
            layoutPath   : 'layout',
            // Name of the default layout file. Can be overriden in routes.
            layout       : 'default-layout'
        });

        super.route(routes);

        // Sadly, we cannot just return the start() promise because of:
        // https://github.com/hapijs/hapi/issues/3217
        return new Promise((resolve, reject) => {
            super.start((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

module.exports = AppServer;
