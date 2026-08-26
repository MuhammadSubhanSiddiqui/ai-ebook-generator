// Generic Joi validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      console.log('Validation error:', messages.join(', '));
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ message: messages.join(', ') });
    }
    req.body = value;
    next();
  };
};