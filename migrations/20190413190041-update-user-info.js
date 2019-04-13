'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return Promise.all([
    db.removeColumn('users', 'first_name'),
    db.removeColumn('users', 'last_name'),
    db.addColumn('users', 'full_name', {
      type: 'string',
      notNull: true,
    }),
  ]);
};

exports.down = function (db) {
  return Promise.all([
    db.removeColumn('users', 'full_name'),
    db.addColumn('users', 'last_name', {
      type: 'string',
      notNull: true,
    }),
    db.addColumn('users', 'first_name', {
      type: 'string',
      notNull: true,
    }),
  ]);
};

exports._meta = {
  "version": 1
};