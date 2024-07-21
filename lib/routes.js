const imports = await Promise.all([
    import('./route/static.js'),
    import('./route/home.js'),
    import('./route/about.js'),
    import('./route/faq.js'),
    import('./route/contact.js'),
    import('./route/donate.js'),
    import('./route/donate/config.js'),
    import('./route/donate/sessions.js'),
    import('./route/donate/sessions/session-id.js'),
    import('./route/donate/success.js')
]);

const routes = imports.flatMap((file) => {
    return file.default;
});

export default routes;
