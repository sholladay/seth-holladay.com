'use strict';

const joi = require('joi');
const schema = require('../../schema');

module.exports = {
    method : 'POST',
    path   : '/donate/send',
    config : {
        description : 'Send a monetary donation',
        notes       : 'Donations help to fund open source projects.',
        tags        : ['donate', 'payment', 'billing'],
        validate    : {
            payload : {
                amount      : joi.number().required().min(100).max(10000000).positive().integer(),
                email       : schema.email.required(),
                stripeToken : schema.stripeToken.required()
            }
        }
    },
    async handler(request, reply) {
        const { stripe, payload } = request;
        const find = (input) => {
            const email = input.toLowerCase();

            return (async function loop(last) {
                const customers = await stripe.customers.list({
                    limit          : 100,
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
            await stripe.customers.update({
                source : payload.stripeToken
            });
        }
        await stripe.charges.create({
            amount               : payload.amount,
            currency             : 'usd',
            customer             : customer.id,
            source               : payload.stripeToken,
            description          : 'Open source donation',
            statement_descriptor : 'Open source donation'
        });
        reply.view('paid');
    }
};
