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
  coverColor: Joi.string().max(50),
});

// Joi validation schema for ebook updates (partial)
export const updateEbookSchema = Joi.object({
  title: Joi.string().max(200),
  description: Joi.string().max(1000),
  coverColor: Joi.string().max(50),
  status: Joi.string().valid('draft', 'generating', 'completed'),
  totalPages: Joi.number().integer().min(0).max(10000),
  content: Joi.array().items(
    Joi.object({
      page: Joi.number().integer().min(1),
      title: Joi.string().max(200),
      text: Joi.string().max(50000),
    })
  ),
});