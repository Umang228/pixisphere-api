const Joi = require('joi');

// User registration schema
const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).trim(),
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required().min(6).max(30),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
  role: Joi.string().valid('client', 'partner', 'admin')
});

// User login schema
const loginSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required().min(6).max(30)
});

// OTP schema
const otpSchema = Joi.object({
  phone: Joi.string().required().pattern(/^[6-9]\d{9}$/),
  otp: Joi.string().min(4).max(6)
});

module.exports = {
  registerSchema,
  loginSchema,
  otpSchema
};