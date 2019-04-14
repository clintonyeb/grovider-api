var _ = require('lodash');
const bcrypt = require('bcrypt');
const Boom = require('boom'); 

const LIMIT = 25;
const OFFSET = 0;

const determineError = require('../utils/errors').determineError

async function getAllUsers(request) {
  const db = request.server.app.pg
  const res = await db.query(`SELECT id,identifier,full_name,email,phone_number,avatar FROM users LIMIT ${LIMIT} OFFSET ${OFFSET};`)
  return res.rows;
}

async function createUser(request) {
  const db = request.server.app.pg
  const payload = request.payload
  
  const hashedPassword = await _hashPassword(payload.password)
  payload.password = hashedPassword
  
  const query = 'INSERT INTO users (full_name,email,phone_number,avatar,password) values ($1,$2,$3,$4,$5) RETURNING *;'
  const values = [payload.full_name, payload.email, payload.phone_number, payload.avatar, payload.password]

  try {
    const res = await db.query(query, values)
    return res.rows;  
  } catch (error) {
    const err = determineError(error)
    return Boom.badRequest(err.message || 'Unknown error has occurred.')
  }
  
}

async function deleteUser(request) {
  const db = request.server.app.pg
  const identificationId = request.params.id
  const query = 'DELETE FROM users WHERE identifier=$1 RETURNING *;'
  const values = [identificationId]
  const res = await db.query(query, values)
  return res.rows;
}

async function updateUser(request) {
  const db = request.server.app.pg
  const identificationId = request.params.id
  const payload = request.payload

  const userQuery = 'SELECT full_name,email,phone_number,avatar FROM users WHERE identity=$1 LIMIT 1'
  const userValues = [identificationId]
  const userRes = await db.query(userQuery, userValues)
  const user = userRes.rows[0]

  const updatedUser = _.assign(user, payload) 

  const query = 'UPDATE users SET full_name = $1, email = $2, phone_number = $3, avatar = $4) WHERE identity=$5 RETURNING *;'
  const values = [updatedUser.full_name, updatedUser.email, updatedUser.phone_number, updatedUser.avatar, identificationId]
  const userRes = await db.query(query, values)
  const user = userRes.rows[0]

  return user;
}

async function getUserWithEmail(request, email) {
  const db = request.server.app.pg
  const query = "SELECT id,full_name,email,password,identifier FROM users WHERE email = $1 LIMIT 1"
  const values = [email]
  const res = await db.query(query, values)
  return res.rows[0]
}

async function validateUserPassword(password, hash) {
  return _checkPassword(password, hash)
}

function _hashPassword(password) {
  return bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
}

function _checkPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserWithEmail,
  validateUserPassword
}