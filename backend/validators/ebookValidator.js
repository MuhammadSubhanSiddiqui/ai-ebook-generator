import Joi from 'joi';

// Joi validation schema for ebook creation (all required)
export const createEbookSchema = Joi.object({
  title: Joi.string().max(200).required().messages({
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().max(1000).required().messages({
    'string.max': 'Description cannot exceed 1000 characters',
    'any.required': 'Description is required',
  }),
  coverColor: Joi.string().max(300).allow(''),
});

// Content item schema.
// NOTE: MongoDB subdocuments include an `_id` key that the frontend echoes back.
// We allow unknown keys (and strip them) so `_id` passes through harmlessly,
// while still validating the meaningful fields (page, title, text).
const contentItemSchema = Joi.object({
  _id: Joi.string().optional(),
  page: Joi.number().integer().min(1),
  title: Joi.string().max(200),
  text: Joi.string().max(50000),
})
  .unknown(true)
  .options({ stripUnknown: true });

// Joi validation schema for ebook updates (partial).
// Requires at least one known field to be present.
export const updateEbookSchema = Joi.object({
  title: Joi.string().max(200).allow(''),
  description: Joi.string().max(1000).allow(''),
  coverColor: Joi.string().max(300).allow(''),
  status: Joi.string().valid('draft', 'generating', 'completed', 'failed'),
  totalPages: Joi.number().integer().min(0).max(10000),
  content: Joi.array().items(contentItemSchema),
})
  .min(1)
  .unknown(false)
  .messages({
    'object.min': 'At least one field is required to update',
  });