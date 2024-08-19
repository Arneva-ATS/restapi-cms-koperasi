
import Joi from 'joi';

// Validation Input Create AdsContent
const createAdsContentSchema = Joi.object({
  title: Joi.string().max(50).required(),
  content: Joi.string(),
  publisher: Joi.string().max(255).required(),
  image: Joi.object({
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
    size: Joi.number().max(2 * 1024 * 1024).required(), // Ukuran maksimal 2 MB
  }).required(),
  url: Joi.string().max(255).required(),
  status: Joi.string().valid('post', 'draft').required(),
  cooperative_center_code: Joi.string().max(30).allow(null).optional(),
  cooperative_branch_code: Joi.string().max(30).allow(null).optional(),
});

// Validation Input Update AdsContent
const updateAdsContentSchema = Joi.object({
  title: Joi.string().max(50),
  content: Joi.string(),
  publisher: Joi.string().max(255),
  image: Joi.object({
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp'),
    size: Joi.number().max(2 * 1024 * 1024), // Ukuran maksimal 2 MB
  }),
  url: Joi.string().max(255),
  status: Joi.string().valid('post', 'draft'),
  cooperative_center_code: Joi.string().max(30).allow(null).optional(),
  cooperative_branch_code: Joi.string().max(30).allow(null).optional(),
});

export { createAdsContentSchema, updateAdsContentSchema };