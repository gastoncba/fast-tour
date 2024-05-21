import Joi from "joi";

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(50);
const description = Joi.string().min(3).max(50).allow(null);
const stars = Joi.number().positive().min(1).max(5);
const placeId = Joi.number().integer().positive();

const take = Joi.number().integer().min(0);
const skip = Joi.number().integer().min(0);

export const createHotelSchema = Joi.object({
  name: name.required(),
  stars: stars.required(),
  description,
  placeId: placeId.required(),
});

export const updateHotelSchema = Joi.object({
  name,
  description,
  stars,
  placeId,
});

export const getHotelSchema = Joi.object({
  id: id.required(),
});

export const queryHotelSchema = Joi.object({
  name: Joi.string().max(50),
  placeId,
  take,
  skip,
});
