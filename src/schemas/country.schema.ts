import Joi from "joi";

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(50);
const code = Joi.string().min(1).max(10);

const take = Joi.number().integer().min(0);
const skip = Joi.number().integer().min(0);
const page = Joi.number().integer().positive().min(1);
const limit = Joi.number().integer().positive().min(1).max(100);

export const createCountrySchema = Joi.object({
  name: name.required(),
  code: code.required(),
});

export const updateCountrySchema = Joi.object({
  name,
  code,
});

export const getCountrySchema = Joi.object({
  id: id.required(),
});

export const queryCountrySchema = Joi.object({
  take,
  skip,
  page,
  limit,
  name: Joi.string().max(50)
});
