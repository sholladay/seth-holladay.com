'use strict';

module.exports = {
    method : 'GET',
    path   : '/contact',
    handler(request, h) {
        return h.view('contact');
    }
};
