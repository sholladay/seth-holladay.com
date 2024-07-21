export default {
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
