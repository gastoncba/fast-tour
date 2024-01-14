import Joi from "joi";

const id = Joi.number().integer();
const name = Joi.string().min(3).max(50);
const img = Joi.string().allow(null);
const countryId = Joi.number().integer();

export const createPlaceSchema = Joi.object({
  name: name.required(),
  img,
  countryId: countryId.required(),
});

export const updatePlaceSchema = Joi.object({
  name,
  img,
  countryId,
});

export const getPlaceSchema = Joi.object({
  id: id.required(),
});
