import Joi from 'joi';

export const auth_validator = {
  login_schema: Joi.object({
    email: Joi.number().min(8).required(),
  }),
  register_schema: Joi.object({
    email: Joi.number().min(8).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
  }),
};
