let mysql = require("mysql2");

export const pool = mysql.createPool({
  host: 'containers-us-west-115.railway.app',
  user: 'root',
  password: 'UPPMN5e5l4lByVyldnfd',
  database: 'railway',
  port: 5819,
});

pool.getConnection((err,connection)=> {
  if(err) {
    throw err;
  }
  console.log('Database connected successfully');
  connection.release();
});