import Joi from 'joi';

// Validation Input Create Cooperative Branch
const createCooperativeBranchSchema = Joi.object({
  cooperative_center_code: Joi.string().max(30).required(),
  name: Joi.string().max(50).required(),
});

// Validation Input Update Cooperative Branch
const updateCooperativeBranchSchema = Joi.object({
  cooperative_center_code: Joi.string().max(30),
  name: Joi.string().max(50),
});

export { createCooperativeBranchSchema, updateCooperativeBranchSchema };