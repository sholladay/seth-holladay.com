import test from 'ava';
import envy from 'envy';
import server from '.';

const env = {
    ...envy(),
    stripePublicKey : 'pk_test_abcdefghijklmnopqrstu',
    stripeSecretKey : 'sk_test_abcdefghijklmnopqrstu'
};

if (!env.stripePublicKey.startsWith('pk_test_')) {
    throw new Error('You must use a test public key to avoid damaging live infrastructure');
}
if (!env.stripeSecretKey.startsWith('sk_test_')) {
    throw new Error('You must use a test secret key to avoid damaging live infrastructure');
}

const mockRequest = (app, option) => {
    return app.inject({
        method : 'GET',
        url    : '/',
        ...option
    });
};

test('starts successfully', async (t) => {
    const app = await server(env);
    await t.notThrows(app.start());
    const response = await mockRequest(app);
    t.is(response.statusCode, 200);
    t.is(response.headers['content-type'], 'text/html; charset=utf-8');
    t.true(response.payload.includes('<title>Seth Holladay</title>'));
    await app.stop();
});
