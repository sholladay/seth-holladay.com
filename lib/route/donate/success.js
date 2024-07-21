export default {
    method : 'GET',
    path   : '/donate/success',
    handler(request, h) {
        return h.view('donate-success');
    }
};
