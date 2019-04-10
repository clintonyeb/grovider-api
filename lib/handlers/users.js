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

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}