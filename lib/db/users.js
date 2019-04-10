var _ = require('lodash');
const bcrypt = require('bcrypt');
const Boom = require('boom'); 

const LIMIT = 25;
const OFFSET = 0;

async function getAllUsers(request) {
  const db = request.server.app.pg
  const res = await db.query(`SELECT id,identifier,first_name,last_name,email,phone_number,avatar FROM users LIMIT ${LIMIT} OFFSET ${OFFSET};`)
  return res.rows;
}

async function createUser(request) {
  const db = request.server.app.pg
  const payload = request.payload
  
  const hashedPassword = await _hashPassword(payload.password)
  payload.password = hashedPassword
  
  const query = 'INSERT INTO users (first_name,last_name,email,phone_number,avatar,password) values ($1,$2,$3,$4,$5,$6) RETURNING *;'
  const values = [payload.first_name, payload.last_name, payload.email, payload.phone_number, payload.avatar, payload.password]

  try {
    const res = await db.query(query, values)
    return res.rows;  
  } catch (error) {
      return Boom.badRequest(error.detail || 'Unknown error has occurred.')
  }
  
}

async function deleteUser(request) {
  const db = request.server.app.pg
  const identificationId = request.params.id
  const query = 'DELETE FROM users WHERE identifier=? RETURNING *;'
  const values = [identificationId]
  const res = await db.query(query, values)
  return res.rows;
}

async function updateUser(request) {
  const db = request.server.app.pg
  const identificationId = request.params.id
  const payload = request.payload

  const userQuery = 'SELECT (first_name,last_name,email,phone_number,avatar) FROM users WHERE identity=? LIMIT 1'
  const userValues = [identificationId]
  const userRes = await db.query(userQuery, userValues)
  const user = userRes.rows[0]

  const updatedUser = _.assign(user, payload) 

  const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, avatar = ?) WHERE identity=? RETURNING *;'
  const values = [updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.phone_number, updatedUser.avatar, identificationId]
  const userRes = await db.query(query, values)
  const user = userRes.rows[0]

  return res.rows;
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
  updateUser
}