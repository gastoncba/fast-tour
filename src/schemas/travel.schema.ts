import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(50)
const price = Joi.number().positive()
const placeId = Joi.number().integer()
const hotelsIds = Joi.array().items(Joi.number().positive())

export const createTravelSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  placeId: placeId.required(),
  hotelsIds: hotelsIds.required()
})

export const updateTravelSchema = Joi.object({
  name: name,
  price: price,
  placeId: placeId,
  hotelsIds: hotelsIds
})

export const getTravelSchema = Joi.object({
  id: id.required()
})
