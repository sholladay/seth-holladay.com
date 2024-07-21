export default {
    method : 'GET',
    path   : '/donate',
    handler(request, h) {
        return h.view('donate');
    }
};
