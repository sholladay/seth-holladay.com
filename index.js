import fs from 'node:fs/promises';
import path from 'node:path';
import hapi from '@hapi/hapi';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import handlebars from 'handlebars';
import alignJson from 'hapi-align-json';
import errorPage from 'hapi-error-page';
import hi from 'hapi-hi';
import requireHttps from 'hapi-require-https';
import zebra from 'hapi-zebra';
import isHeroku from 'is-heroku';
import joi from 'joi';
import portType from 'port-type';
import * as context from './lib/context.js';
import routes from './lib/routes.js';
import schema from './lib/schema.js';

const provision = async (option) => {
    const value = joi.attempt(option, joi.object().required().keys({
        port            : joi.number().optional().port().default(portType.haveRights(443) ? 443 : 3000),
        stripePublicKey : schema.stripePublicKey.required(),
        stripeSecretKey : schema.stripeSecretKey.required()
    }));

    const config = {
        tls : !isHeroku && {
            key  : await fs.readFile(path.join(import.meta.dirname, 'lib', 'tls', 'localhost.key')),
            cert : await fs.readFile(path.join(import.meta.dirname, 'lib', 'tls', 'localhost-chain.cert'))
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
                relativeTo : path.join(import.meta.dirname, 'lib', 'static')
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
                cwd : import.meta.dirname
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
        context    : { ...context },
        relativeTo : path.join(import.meta.dirname, 'lib', 'views'),
        path       : 'pages',
        layoutPath : 'layouts',
        // Name of the default layout file. Can be overriden in routes.
        layout     : 'main-layout'
    });

    server.route(routes);

    return server;
};

export default provision;
