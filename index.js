'use strict';

const fs = require('fs');
const path = require('path');
const portType = require('port-type');
const joi = require('joi');
const hapi = require('hapi');
const hi = require('hapi-hi');
const errorPage = require('hapi-error-page');
const alignJson = require('hapi-align-json');
const zebra = require('hapi-zebra');
const inert = require('inert');
const vision = require('vision');
const handlebars = require('handlebars');

/* eslint-disable global-require */
const routes = [
    require('./lib/route/static'),
    require('./lib/route/home'),
    require('./lib/route/about'),
    require('./lib/route/faq'),
    require('./lib/route/contact'),
    require('./lib/route/donate'),
    require('./lib/route/donate/send')
];
/* eslint-enable global-require */

const provision = async (option) => {
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

    const server = hapi.server({
        debug : {
            log     : ['error'],
            request : ['error']
        },
        routes : {
            files : {
                relativeTo : path.join(__dirname, 'lib', 'static')
            }
        },
        host   : 'localhost',
        port   : config.port,
        tls    : config.tls
    });

    Object.assign(server.app, config);

    await server.register([
        {
            plugin  : hi,
            options : {
                cwd : __dirname
            }
        },
        {
            plugin  : zebra,
            options : {
                secretKey : config.stripeSecretKey
            }
        },
        inert,
        vision,
        errorPage,
        alignJson
    ]);

    // Template rendering configuration using "vision" plugin.
    server.views({
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

    server.route(routes);

    return server;
};

module.exports = provision;
