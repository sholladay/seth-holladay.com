'use strict';

module.exports = {
    method : 'GET',
    path   : '/donate/success',
    handler(request, h) {
        return h.view('donate-success');
    }
};
