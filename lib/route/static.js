'use strict';

module.exports = {
    method : 'GET',
    path   : '/static/{file*}',
    config : {
        auth : false
    },
    handler : {
        directory : {
            path            : '.',
            redirectToSlash : true
        }
    }
};
