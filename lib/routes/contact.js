export default {
    method : 'GET',
    path   : '/contact',
    handler(request, h) {
        return h.view('contact');
    }
};
