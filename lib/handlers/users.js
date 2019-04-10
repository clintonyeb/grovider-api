const Boom = require('boom'); 
const jwt = require('jsonwebtoken');
const db = require('../db').users

async function getAllUsers(request, h) {
  return db.getAllUsers(request);
}

async function createUser(request, h) {
  return db.createUser(request);
}

async function updateUser(request, h) {
  return db.updateUser(request);
}

async function deleteUser(request, h) {
  return db.deleteUser(request);
}

async function login(request, h) {
  const payload = request.payload;
  const user = await db.getUserWithEmail(request, payload.email)

  if(!user) {
    return Boom.unauthorized("Invalid username and password.");
  }
  const valid = db.validateUserPassword(payload.password, user.password)

  if(!valid) {
    return Boom.unauthorized("Invalid username and password.");
  }

  const token = await _generateToken({
    user_id: user.id,
    identifier: user.identifier,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  }) 

  return {status: true, token: token};
}

function logout(request, h) {
  return null;
}

async function _generateToken(payload) {
  const token = await jwt.sign(
    payload, 
    process.env.SECRET, {
      expiresIn: '7d',
      issuer: "grovider.com",
      algorithm: 'HS256'
   });
  return token;
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout
}