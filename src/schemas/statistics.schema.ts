import Joi from "joi";

const year = Joi.number().integer().positive().min(2000);

export const getFrequencySchema = Joi.object({
  year: year.required(),
});
