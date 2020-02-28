'use strict';

const fs = require('fs');
const path = require('path');
const hapi = require('@hapi/hapi');
const joi = require('@hapi/joi');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const handlebars = require('handlebars');
const alignJson = require('hapi-align-json');
const errorPage = require('hapi-error-page');
const hi = require('hapi-hi');
const requireHttps = require('hapi-require-https');
const zebra = require('hapi-zebra');
const isHeroku = require('is-heroku');
const portType = require('port-type');
const schema = require('./lib/schema');

/* eslint-disable global-require */
const routes = [
    require('./lib/route/static'),
    require('./lib/route/home'),
    require('./lib/route/about'),
    require('./lib/route/faq'),
    require('./lib/route/contact'),
    require('./lib/route/donate'),
    require('./lib/route/donate/config'),
    require('./lib/route/donate/sessions'),
    require('./lib/route/donate/sessions/session-id'),
    require('./lib/route/donate/success')
];
/* eslint-enable global-require */

const provision = async (option) => {
    const value = joi.attempt(option, joi.object().required().keys({
        port            : joi.number().optional().port().default(portType.haveRights(443) ? 443 : 3000),
        stripePublicKey : schema.stripePublicKey.required(),
        stripeSecretKey : schema.stripeSecretKey.required()
    }));

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
        app   : config,
        debug : {
            log     : ['error'],
            request : ['error']
        },
        host   : isHeroku ? null : 'localhost',
        port   : config.port,
        routes : {
            files : {
                relativeTo : path.join(__dirname, 'lib', 'static')
            },
            security : true
        },
        tls : config.tls
    });

    await server.register([
        requireHttps,
        {
            plugin  : hi,
            options : {
                cwd : __dirname
            }
        },
        {
            plugin  : zebra,
            options : {
                apiVersion : '2019-12-03',
                secretKey  : config.stripeSecretKey
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
