'use strict';

// Common data structures used in our API.

const joi = require('@hapi/joi');

const string = joi.string().trim();
const stripeCustomerId = string.required().token().min(10).regex(/^cus_/u);

const schema = {
    string,
    stripeCustomer     : joi.object().required().unknown().keys({ id : stripeCustomerId.required() }),
    stripeCustomerId,
    stripePublicKey    : string.required().token().min(25).regex(/^pk_/u),
    stripeSecretKey    : string.required().token().min(25).regex(/^sk_/u),
    stripeSessionId    : string.required().token().min(10).regex(/^cs_/u),
    stripeSessionItems : joi.array().required().unique().items(joi.object())
};

module.exports = schema;
