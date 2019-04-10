const { Pool } = require('pg')

module.exports = {
  name: 'pg',
  register: async function (server, options) {
    const pool = new Pool()
    await pool.connect()
    const res = await pool.query('SELECT $1::text as message', ['Postgres DB Connection successful!'])
    server.log('info', res.rows[0].message)
    server.app.pg = pool
  },
};