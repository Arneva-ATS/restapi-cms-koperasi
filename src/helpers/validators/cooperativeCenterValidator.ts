import Joi from 'joi';

// Validation Input Create CooperativeCenter
const createCooperativeCenterSchema = Joi.object({
  name: Joi.string().max(50).required(),
});

// Validation Input Update CooperativeCenter
const updateCooperativeCenterSchema = Joi.object({
  name: Joi.string().max(50),
});

export { createCooperativeCenterSchema, updateCooperativeCenterSchema };