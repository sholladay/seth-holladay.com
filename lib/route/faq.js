'use strict';

module.exports = {
    method : 'GET',
    path   : '/faq',
    handler(request, h) {
        return h.view('faq');
    }
};
