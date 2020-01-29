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
                customer : schema.stripeCustomer.required(),
                items    : schema.stripeSessionItems.required(),
                id       : schema.stripeSessionId.required(),
                mode     : schema.string.required()
            })
        }
    },
    async handler(request) {
        const { sessionId } = request.params;
        const { stripe } = request.server;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return {
            customer     : session.customer,
            displayItems : session.display_items,
            id           : session.id,
            mode         : session.mode
        };
    }
};
