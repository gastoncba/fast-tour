import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(50)
const description = Joi.string().min(3).max(50).allow(null)
const stars = Joi.number().positive().min(1).max(5)
const placeId = Joi.number().integer()

export const createHotelSchema = Joi.object({
  name: name.required(),
  stars: stars.required(),
  description,
  placeId: placeId.required()
})

export const updateHotelSchema = Joi.object({
  name,
  description,
  stars,
  placeId
})

export const getHotelSchema = Joi.object({
  id: id.required()
})
