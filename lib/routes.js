const imports = await Promise.all([
    import('./routes/static.js'),
    import('./routes/home.js'),
    import('./routes/about.js'),
    import('./routes/faq.js'),
    import('./routes/contact.js'),
    import('./routes/donate.js'),
    import('./routes/donate/config.js'),
    import('./routes/donate/sessions.js'),
    import('./routes/donate/sessions/session-id.js'),
    import('./routes/donate/success.js')
]);

const routes = imports.flatMap((file) => {
    return file.default;
});

export default routes;
