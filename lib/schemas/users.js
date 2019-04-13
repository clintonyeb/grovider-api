const Joi = require('joi');

const createUser = Joi.object({
  full_name: Joi.string().required().trim().lowercase(),
  email: Joi.string().trim().lowercase().email(),
  phone_number: Joi.string().trim().lowercase(),
  password: Joi.string().required().min(4),
  avatar: Joi.string()
}).options({ stripUnknown: true })

const paginationQueries = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  page: Joi.number().integer().min(1).default(1),
}).options({ stripUnknown: true })

const updateUser = Joi.object({
  full_name: Joi.string().trim().lowercase(),
  email: Joi.string().trim().lowercase().email(),
  phone_number: Joi.string().trim().lowercase(),
  password: Joi.string().trim().lowercase().min(4),
  avatar: Joi.string()
}).options({ stripUnknown: true })

const updateUserParam = Joi.object({
  id: Joi.number().integer().min(1).required()
}).options({ stripUnknown: true })

const login = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required()
}).options({ stripUnknown: true })

const logout = Joi.object({
  id: Joi.number().integer().min(1).required(),
  token: Joi.string().required()
}).options({ stripUnknown: true })

module.exports = {
  createUser,
  paginationQueries,
  updateUser,
  updateUserParam,
  login,
  logout
}