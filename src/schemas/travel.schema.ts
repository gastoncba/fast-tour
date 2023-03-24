import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(15)
const price = Joi.number().positive()
const idPlace = Joi.number().integer()

export const createTravelSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  idPlace: idPlace.required()
})

export const updateTravelSchema = Joi.object({
  name: name,
  price: price,
  idPlace: idPlace
})

export const getTravelSchema = Joi.object({
  id: id.required()
})
