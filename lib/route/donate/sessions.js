'use strict';

const joi = require('joi');
const schema = require('../../schema');

module.exports = {
    method : 'POST',
    path   : '/donate/sessions',
    config : {
        description : 'Begin the donation process',
        notes       : 'Donations help to fund open source projects.',
        tags        : ['donate', 'payment'],
        validate    : {
            payload : joi.object().required().keys({
                amount : joi.number().required().positive().integer().min(100).max(10000000)
            })
        },
        response : {
            schema : joi.object().required().keys({
                id : schema.stripeSessionId.required()
            })
        }
    },
    async handler(request) {
        const { payload } = request;
        const { stripe } = request.server;

        /* eslint-disable camelcase */
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            line_items           : [{
                amount      : payload.amount,
                currency    : 'usd',
                description : 'Your gift will improve the privacy and security of the web.',
                images      : ['https://gravatar.com/avatar/c65c7991822f827780a2cae38c5c31a2?size=300'],
                name        : 'Open Source Donation',
                quantity    : 1
            }],
            submit_type : 'donate',
            success_url : 'https://' + request.info.host + '/donate/success?sessionId={CHECKOUT_SESSION_ID}',
            cancel_url  : 'https://' + request.info.host + '/donate'
        });
        /* eslint-enable camelcase */

        return { id : session.id };
    }
};
