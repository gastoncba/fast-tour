import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(50)
const star = Joi.number().positive().min(1).max(5)

export const createHotelSchema = Joi.object({
  name: name.required(),
  star: star.required(),
})

export const updateHotelSchema = Joi.object({
  name: name,
  star: star,
})

export const getHotelSchema = Joi.object({
  id: id.required()
})
