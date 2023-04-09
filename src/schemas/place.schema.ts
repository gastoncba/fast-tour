import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(50)
const img = Joi.string();
const countryId = Joi.number().integer()

export const createPlaceSchema = Joi.object({
  name: name.required(),
  img: img.required(),
  countryId: countryId.required()
})

export const updatePlaceSchema = Joi.object({
  name: name,
  img: img,
  idCountry: countryId
})

export const getPlaceSchema = Joi.object({
  id: id.required()
})
