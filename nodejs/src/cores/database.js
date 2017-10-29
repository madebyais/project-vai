/*
*
*   core/database.js
*   Used to define the base class for Database.
*
*/

import ENV from '../../env';
import { debug } from '../../config/common';
import DATABASE_CONFIG from '../../config/database';
import mysql from 'mysql';

class Database {

  constructor () {
    this.db = {};
  }

  initialize () {
    if (debug) console.time('init_db_connection');
    try {
      this.db = mysql.createConnection(DATABASE_CONFIG[ENV].mysql);
    } catch (e) {
      console.dir(e)
    }

    if (debug) console.timeEnd('init_db_connection');
  }

  migrate () {
    const query = "CREATE TABLE IF NOT EXISTS `tbl_data` ( \
      `id` int NOT NULL AUTO_INCREMENT, \
      `year` int(4) NOT NULL, \
      `income_top_10` numeric(12,12) NOT NULL, \
      `wealth_top_10` numeric(12,12) NOT NULL, \
      `income_bottom_50` numeric(12,12) NOT NULL, \
      `wealth_bottom_50` numeric(12,12) NOT NULL, \
      PRIMARY KEY (`id`) \
    ) DEFAULT CHARSET=utf8;";

    if (debug) console.time('init_db_migration');
    this.db.connect();
    this.db.query(query, function (err, result, fields) {
      if (err) throw err;
      if (debug && result) console.log(`Database migration OK`)
    });
    this.db.end();
    if (debug) console.timeEnd('init_db_migration');
  }

  raw (query, opts, cb) {
    this.db.connect();
    this.db.query(query, opts, cb);
    this.db.end();
  }

}

module.exports = new Database();
