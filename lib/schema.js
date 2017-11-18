'use strict';

// Common data structures used in our API.

const joi = require('joi');

const schema = {
    email        : joi.string().required().email(),
    stripeToken  : joi.string().required().min(10).token().regex(/^tok_/)
};

module.exports = schema;
