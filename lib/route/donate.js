'use strict';

module.exports = {
    method : 'GET',
    path   : '/donate',
    handler(request, h) {
        return h.view('donate');
    }
};
