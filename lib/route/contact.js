'use strict';

module.exports = {
    method : 'GET',
    path   : '/contact',
    handler(request, reply) {
        reply.view('contact');
    }
};
