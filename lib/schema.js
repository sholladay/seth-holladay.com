// Common data structures used in our API.

import joi from 'joi';

const string = joi.string().trim();
const stripeCustomerId = string.required().token().min(10).regex(/^cus_/u);
const stripePaymentIntentId = string.required().token().min(10).regex(/^pi_/u);

export default {
    string,
    stripeCustomer      : joi.object().required().unknown().keys({ id : stripeCustomerId.required() }),
    stripePublicKey     : string.required().token().min(25).regex(/^pk_/u),
    stripeSecretKey     : string.required().token().min(25).regex(/^sk_/u),
    stripeSessionId     : string.required().token().min(10).regex(/^cs_/u),
    stripePaymentIntent : joi.object().required().unknown().keys({ id : stripePaymentIntentId.required() })
};
