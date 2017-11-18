'use strict';

module.exports = {
    method : 'GET',
    path   : '/faq',
    handler(request, reply) {
        reply.view('faq');
    }
};
