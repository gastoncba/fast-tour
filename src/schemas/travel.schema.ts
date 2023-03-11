import Joi from "joi";

const id = Joi.string().alphanum()
const name = Joi.string().min(3).max(15)
const price = Joi.number().positive()

export const createTravelSchema = Joi.object({
  name: name.required(),
  price: price.required()
})

export const updateTravelSchema = Joi.object({
  name: name,
  price: price
})

export const getTravelSchema = Joi.object({
  id: id.required()
})
