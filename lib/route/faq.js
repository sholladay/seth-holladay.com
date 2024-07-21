export default {
    method : 'GET',
    path   : '/faq',
    handler(request, h) {
        return h.view('faq');
    }
};
