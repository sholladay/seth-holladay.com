'use strict';

const joi = require('@hapi/joi');
const schema = require('../../../schema');

module.exports = {
    method : 'GET',
    path   : '/donate/sessions/{sessionId}',
    config : {
        description : 'Look up an existing donation session',
        notes       : 'Donations help to fund open source projects.',
        tags        : ['donate', 'payment'],
        validate    : {
            params : joi.object().required().keys({
                sessionId : schema.stripeSessionId.required()
            })
        },
        response : {
            schema : joi.object().required().keys({
                customer      : schema.stripeCustomer.required(),
                id            : schema.stripeSessionId.required(),
                metadata      : joi.object().required(),
                mode          : schema.string.required(),
                paymentIntent : schema.stripePaymentIntent.required()
            })
        }
    },
    async handler(request) {
        const { sessionId } = request.params;
        const { stripe } = request.server;
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand : ['customer', 'payment_intent']
        });
        return {
            customer : {
                email : session.customer.email,
                id    : session.customer.id
            },
            id            : session.id,
            metadata      : session.metadata,
            mode          : session.mode,
            paymentIntent : {
                amount : session.payment_intent.amount,
                id     : session.payment_intent.id
            }
        };
    }
};
