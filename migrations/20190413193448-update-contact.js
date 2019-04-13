'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {

  const allConstraintQuery = "ALTER TABLE users ADD CONSTRAINT Email_PhoneNumber_OR  CHECK (email is not null or phone_number is not null);"

  return Promise.all([
    db.removeColumn('users', 'email'),
    db.addColumn('users', 'email', {
      type: 'string',
      unique: true
    }),
    db.removeColumn('users', 'phone_number'),
    db.addColumn('users', 'phone_number', {
      type: 'string',
      unique: true
    }),
    db.runSql(allConstraintQuery)
  ]);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
