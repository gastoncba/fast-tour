import Joi from "joi";

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(50);
const description = Joi.string().allow(null);
const img = Joi.string().allow(null);
const countryId = Joi.number().integer().positive();

export const createPlaceSchema = Joi.object({
  name: name.required(),
  description,
  img,
  countryId: countryId.required(),
});

export const updatePlaceSchema = Joi.object({
  name,
  description,
  img,
  countryId,
});

export const getPlaceSchema = Joi.object({
  id: id.required(),
});

export const queryPlaceSchema = Joi.object({
  name: Joi.string().max(50),
  countryId
})
