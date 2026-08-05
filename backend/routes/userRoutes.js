import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/userValidator.js';

const router = express.Router();

router.post('/', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), authUser);

export default router;