import Joi from "joi";
import JoiDate from "@joi/date";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(50)
const img = Joi.string()

const startDate = Joi.extend(JoiDate).date().format("DD/MM/YYYY")
const endDate = Joi.extend(JoiDate).date().format("DD/MM/YYYY")

const price = Joi.number().integer().positive()
const placeId = Joi.number().integer()
const hotelsIds = Joi.array().items(Joi.number().positive())

const max_price = Joi.number().integer().positive()
const min_price = Joi.number().integer().positive().min(0)
const take = Joi.number().integer().positive()
const skip = Joi.number().integer().positive()
const fromDate = Joi.extend(JoiDate).date().format("DD/MM/YYYY")
const toDate = Joi.extend(JoiDate).date().format("DD/MM/YYYY")

export const createTravelSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  startDate: startDate.required(),
  endDate: endDate.required(),
  img: img.required(),
  placeId: placeId.required(),
  hotelsIds: hotelsIds.required()
})

export const updateTravelSchema = Joi.object({
  name: name,
  price: price,
  startDate: startDate,
  endDate: endDate,
  img: img,
  placeId: placeId,
  hotelsIds: hotelsIds
})

export const getTravelSchema = Joi.object({
  id: id.required()
})

export const queryTravelSchema = Joi.object({
  take,
  skip,
  min_price,
  max_price: max_price.when('min_price', {
    is: min_price.required(),
    then: Joi.required()
  }),
  fromDate,
  toDate,
  placeId
})
