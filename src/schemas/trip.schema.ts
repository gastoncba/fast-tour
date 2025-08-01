import Joi from "joi";
import JoiDate from "@joi/date";

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(50);
const description = Joi.string().allow(null);
const img = Joi.string().allow(null);
const price = Joi.number().positive();
const startDate = Joi.extend(JoiDate).date().format("YYYY-MM-DD");
const endDate = Joi.extend(JoiDate).date().format("YYYY-MM-DD");
const placesId = Joi.array().items(Joi.number().integer().positive());

const maxPrice = Joi.number().positive();
const minPrice = Joi.number().positive().min(0);
const take = Joi.number().integer().min(0);
const skip = Joi.number().integer().min(0);
const page = Joi.number().integer().positive().min(1);
const limit = Joi.number().integer().positive().min(1).max(100);
const start = Joi.extend(JoiDate).date().format("YYYY-MM-DD");
const end = Joi.extend(JoiDate).date().format("YYYY-MM-DD");
const places = Joi.string();

export const createTripSchema = Joi.object({
  name: name.required(),
  description,
  price: price.required(),
  startDate: startDate.required(),
  endDate: endDate.required(),
  img,
  placesId: placesId.required(),
});

export const updateTripSchema = Joi.object({
  name,
  description,
  price,
  startDate,
  endDate,
  img,
  placesId,
});

export const getTripSchema = Joi.object({
  id: id.required(),
});

export const queryTripSchema = Joi.object({
  take,
  skip,
  page,
  limit,
  minPrice,
  maxPrice: maxPrice.when("minPrice", {
    is: minPrice.required(),
    then: Joi.required(),
  }),
  start,
  end,
  places,
  name: Joi.string().max(50)
});
