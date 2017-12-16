'use strict';

module.exports = {
    method : 'GET',
    path   : '/about',
    handler(request, h) {
        return h.view('about');
    }
};
