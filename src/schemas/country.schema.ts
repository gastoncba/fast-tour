import Joi from "joi"

const id = Joi.string().alphanum()
const name = Joi.string().min(3).max(50)

export const createCountrySchema = Joi.object({
  name: name.required()
})

export const updateCountrySchema = Joi.object({
  name: name
})

export const getCountrySchema = Joi.object({
  id: id.required()
})
