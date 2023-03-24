import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(15)
const description = Joi.string().min(3).max(50)
const idCountry = Joi.number().integer()

export const createPlaceSchema = Joi.object({
  name: name.required(),
  description: description.required(),
  idCountry: idCountry.required()
})

export const updatePlaceSchema = Joi.object({
  name: name,
  description: description,
  idCountry: idCountry
})

export const getPlaceSchema = Joi.object({
  id: id.required()
})
