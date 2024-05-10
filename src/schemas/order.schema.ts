import Joi from "joi";
import JoiDate from "@joi/date";

const placeSchema = Joi.object({
  placeId: Joi.number().required(),
  hotelId: Joi.number().required()
});

const purchaseDate = Joi.extend(JoiDate).date().format("YYYY-MM-DD");
const userId = Joi.number().integer().positive()
const tripId = Joi.number().integer().positive();
const placesVisited = Joi.array().items(placeSchema);
const numberPeople = Joi.number().integer().positive();
const firstName = Joi.string()
const lastName = Joi.string()
const email = Joi.string()

export const createOrderSchema = Joi.object({
  purchaseDate: purchaseDate.required(),
  userId,
  tripId: tripId.required(),
  placesVisited: placesVisited.required(),
  numberPeople: numberPeople.required(),
  firstName,
  lastName,
  email
})
