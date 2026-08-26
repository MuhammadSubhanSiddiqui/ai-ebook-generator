import { registerSchema, loginSchema, updateProfileSchema } from '../validators/userValidator.js';
import { createEbookSchema, updateEbookSchema } from '../validators/ebookValidator.js';
import { sanitizePromptInput } from '../services/geminiService.js';

describe('Validator Schemas & Sanitization Edge Cases', () => {
  describe('User Registration Validator', () => {
    it('should validate complete valid registration data', () => {
      const { error } = registerSchema.validate({
        name: 'Valid User',
        email: 'user@example.com',
        password: 'Password123!',
      });
      expect(error).toBeUndefined();
    });

    it('should reject email with invalid domain or format', () => {
      const { error } = registerSchema.validate({
        name: 'User',
        email: 'invalid-email-format',
        password: 'Password123!',
      });
      expect(error).toBeDefined();
    });

    it('should reject password with no special character or number', () => {
      const { error } = registerSchema.validate({
        name: 'User',
        email: 'user@example.com',
        password: 'PasswordOnly',
      });
      expect(error).toBeDefined();
    });
  });

  describe('eBook Schemas Validator', () => {
    it('should validate valid ebook creation payload', () => {
      const { error } = createEbookSchema.validate({
        title: 'Valid Ebook Title',
        description: 'Valid description of the ebook',
        coverColor: 'bg-blue-500',
      });
      expect(error).toBeUndefined();
    });

    it('should reject ebook creation with title exceeding 200 chars', () => {
      const { error } = createEbookSchema.validate({
        title: 'A'.repeat(205),
        description: 'Valid description',
      });
      expect(error).toBeDefined();
      expect(error.message).toMatch(/cannot exceed 200 characters/i);
    });

    it('should reject update with no fields', () => {
      const { error } = updateEbookSchema.validate({});
      expect(error).toBeDefined();
    });

    it('should allow valid status enum values including failed', () => {
      ['draft', 'generating', 'completed', 'failed'].forEach((status) => {
        const { error } = updateEbookSchema.validate({ status });
        expect(error).toBeUndefined();
      });
    });

    it('should reject invalid status string', () => {
      const { error } = updateEbookSchema.validate({ status: 'invalid_status_enum' });
      expect(error).toBeDefined();
    });
  });

  describe('Prompt Input Sanitization', () => {
    it('should clean prompt delimiters and control characters', () => {
      const dirty = 'My Title\n\rwith "quotes" and --- delimiters';
      const clean = sanitizePromptInput(dirty);
      expect(clean).not.toContain('\n');
      expect(clean).not.toContain('\r');
      expect(clean).not.toContain('---');
    });

    it('should truncate excessively long inputs to 1000 characters', () => {
      const longInput = 'X'.repeat(1500);
      const clean = sanitizePromptInput(longInput);
      expect(clean.length).toBeLessThanOrEqual(1000);
    });
  });
});
