'use strict';

module.exports = {
    method : 'GET',
    path   : '/donate',
    handler(request, reply) {
        reply.view('donate', {
            stripePublicKey : request.server.app.stripePublicKey
        });
    }
};
