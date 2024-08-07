import joi from 'joi';
import schema from '../../schema.js';

export default {
    method : 'GET',
    path   : '/donate/config',
    config : {
        description : 'Retrieve the settings for starting a donation',
        notes       : 'Includes the public key for the payment gateway.',
        tags        : ['donate', 'payment'],
        response    : {
            schema : joi.object().required().keys({
                publicKey : schema.stripePublicKey.required()
            })
        }
    },
    handler(request) {
        return {
            publicKey : request.server.settings.app.stripePublicKey
        };
    }
};
