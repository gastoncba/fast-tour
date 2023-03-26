import Joi from "joi"

const id = Joi.string().alphanum()
const name = Joi.string().min(3).max(50)
const take = Joi.number().integer()
const skip = Joi.number().integer()

export const createCountrySchema = Joi.object({
  name: name.required()
})

export const updateCountrySchema = Joi.object({
  name: name
})

export const getCountrySchema = Joi.object({
  id: id.required()
})

export const queryCountrySchema = Joi.object({
  take: take,
  skip: skip
})
