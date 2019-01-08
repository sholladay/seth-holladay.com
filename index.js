'use strict';

const fs = require('fs');
const path = require('path');
const isHeroku = require('is-heroku');
const portType = require('port-type');
const handlebars = require('handlebars');
const hapi = require('hapi');
const hi = require('hapi-hi');
const alignJson = require('hapi-align-json');
const errorPage = require('hapi-error-page');
const zebra = require('hapi-zebra');
const inert = require('inert');
const joi = require('joi');
const vision = require('vision');

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
        stripePublicKey : joi.string().required().token().min(25).regex(/^pk_/u),
        stripeSecretKey : joi.string().required().token().min(25).regex(/^sk_/u)
    });

    const config = {
        tls : !isHeroku && {
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
        host   : isHeroku ? null : 'localhost',
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
