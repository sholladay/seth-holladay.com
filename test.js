import test from 'ava';
import envy from 'envy';
import server from './index.js';

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

test('starts successfully', async (t) => {
    const app = await server(env);
    await t.notThrowsAsync(app.start());
    const response = await app.inject('/');
    t.is(response.statusCode, 200);
    t.is(response.headers['content-type'], 'text/html; charset=utf-8');
    t.true(response.payload.includes('<title>Seth Holladay</title>'));
    await app.stop();
});
