const Joi = require('joi');

const authSchemas = {
    register: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
};

const courseSchemas = {
    create: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(500).allow('', null),
    }),
    update: Joi.object({
        name: Joi.string().min(2).max(100),
        description: Joi.string().max(500).allow('', null),
    })
};

const taskSchemas = {
    create: Joi.object({
        title: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(500).allow('', null),
        dueDate: Joi.string().isoDate().allow('', null),
    }),
    update: Joi.object({
        title: Joi.string().min(2).max(100),
        description: Joi.string().max(500).allow('', null),
        dueDate: Joi.string().isoDate().allow('', null),
        status: Joi.string().valid('pending', 'completed')
    })
};

module.exports = { authSchemas, courseSchemas, taskSchemas };
