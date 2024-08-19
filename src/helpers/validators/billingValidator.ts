
import Joi from 'joi';

// Validation Input Create Billing
const createBillingSchema = Joi.object({
  title: Joi.string().max(50).required(),
  price: Joi.number().integer().positive().required(),
  payment_period: Joi.string().valid('one_month', 'three_months', 'six_months', 'one_year').required(),
  description: Joi.string().max(255).allow(null).optional(),
  status: Joi.string().valid('active', 'inactive').required(),
});

// Validation Input Update Billing
const updateBillingSchema = Joi.object({
  title: Joi.string().max(50),
  price: Joi.number().integer().positive(),
  payment_period: Joi.string().valid('one_month', 'three_months', 'six_months', 'one_year'),
  description: Joi.string().max(255).allow(null).optional(),
  status: Joi.string().valid('active', 'inactive'),
});

export { createBillingSchema, updateBillingSchema };