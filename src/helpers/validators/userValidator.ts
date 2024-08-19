
import Joi from 'joi';

// Validation Input Create User
const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(), 
  cooperative_center_code: Joi.string().allow(null).optional(),
  cooperative_branch_code: Joi.string().allow(null).optional()
});

// Validation Input Update User
const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  role: Joi.string(),
  cooperative_center_code: Joi.string().allow(null).optional(),
  cooperative_branch_code: Joi.string().allow(null).optional()
});

export { createUserSchema, updateUserSchema };