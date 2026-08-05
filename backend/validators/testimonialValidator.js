import Joi from 'joi';

// Create testimonial schema
export const createTestimonialSchema = Joi.object({
  text: Joi.string().required().min(3).max(1000).messages({
    'string.min': 'Testimonial must be at least 3 characters long',
    'string.max': 'Testimonial cannot exceed 1000 characters',
    'any.required': 'Testimonial text is required',
  }),
  role: Joi.string().max(100),
});