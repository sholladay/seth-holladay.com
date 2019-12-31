'use strict';

// Common data structures used in our API.

const joi = require('@hapi/joi');

const schema = {
    email       : joi.string().required().email(),
    stripeToken : joi.string().required().min(10).token().regex(/^tok_/u)
};

module.exports = schema;
