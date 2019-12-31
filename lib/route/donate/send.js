'use strict';

const joi = require('@hapi/joi');
const schema = require('../../schema');

module.exports = {
    method : 'POST',
    path   : '/donate/send',
    config : {
        description : 'Send a monetary donation',
        notes       : 'Donations help to fund open source projects.',
        tags        : ['donate', 'payment', 'billing'],
        validate    : {
            payload : joi.object().required().keys({
                amount      : joi.number().required().positive().integer().min(100).max(10000000),
                email       : schema.email.required(),
                stripeToken : schema.stripeToken.required()
            })
        }
    },
    async handler(request, h) {
        const { payload } = request;
        const { stripe } = request.server;

        const find = (input) => {
            const email = input.toLowerCase();

            return (async function loop(last) {
                const customers = await stripe.customers.list({
                    limit          : 100,
                    // eslint-disable-next-line camelcase
                    starting_after : last && last.id
                });
                const found = customers.data.find((customer) => {
                    return customer.email.toLowerCase() === email;
                });
                if (found) {
                    return found;
                }
                return customers.has_more ? loop(customers[customers.length - 1]) : null;
            }());
        };
        const existingCustomer = await find(payload.email);
        const customer = existingCustomer || await stripe.customers.create({
            description : 'Open source donor',
            email       : payload.email,
            source      : payload.stripeToken
        });
        if (existingCustomer) {
            await stripe.customers.update(customer.id, {
                source : payload.stripeToken
            });
        }
        await stripe.charges.create({
            amount               : payload.amount,
            currency             : 'usd',
            customer             : customer.id,
            description          : 'Open source donation',
            // eslint-disable-next-line camelcase
            statement_descriptor : 'Open source donation'
        });
        return h.view('paid');
    }
};
