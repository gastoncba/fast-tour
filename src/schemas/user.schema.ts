import Joi from "joi";

const firstName = Joi.string();
const lastName = Joi.string();
const email = Joi.string().email();
const password = Joi.string();
const roleId = Joi.number().positive().integer();
const userId = Joi.number().positive().integer();

const take = Joi.number().integer().min(0);
const skip = Joi.number().integer().min(0);
const page = Joi.number().integer().positive().min(1);
const limit = Joi.number().integer().positive().min(1).max(100);

const message = Joi.string().min(1);

export const createUserSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  email: email.required(),
  password: password.required(),
  roleId: roleId.required(),
});

export const updateUserSchema = Joi.object({
  firstName,
  lastName,
  email,
});

export const getOrdersByUserSchema = Joi.object({
  userId,
});

export const queryUserSchema = Joi.object({
  take,
  skip,
  page,
  limit,
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  email: Joi.string().email(),
  roleId,
});

export const sendMessageSchema = Joi.object({
  message: message.required(),
});
