var mysql = require("mysql2");

var pool = mysql.createPool({
  host: 'containers-us-west-115.railway.app',
  user: 'root',
  password: 'H9tntREQPSj7vFEK4ygp',
  database: 'railway',
  port: 5819,
  // host: 'localhost',
  // user: 'root',
  // password: 'password',
  // database: 'sys',
});

pool.getConnection((err,connection)=> {
  if(err) {
    throw err;
  }
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool