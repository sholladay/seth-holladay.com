export default {
    method : 'GET',
    path   : '/',
    handler(request, h) {
        return h.view('home');
    }
};
