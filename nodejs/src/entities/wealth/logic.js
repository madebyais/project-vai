import Database from '../../cores/Database';

export default class Wealth {

  constructor () {
      this.db = Database;
  }

  get (type, start, end, cb) {
    let query;

    switch(type) {
      case `top-10`:
        query = `SELECT year, wealth_top_10 FROM tbl_data WHERE year >= ? AND year <= ?`;
        break;
      case `bottom-50`:
        query = `SELECT year, wealth_bottom_50 FROM tbl_data WHERE year >= ? AND year <= ?`;
        break;
      default:
        query = `SELECT year, wealth_top_10, wealth_bottom_50 FROM tbl_data WHERE year >= ? AND year <= ?`;
        break;
    }

    try {
      if (parseInt(end) == 0) end = start;
    } catch (e) {
      end = start;
    }

    let opts = [];
    opts.push(start);
    opts.push(end)

    this.db.initialize();
    this.db.raw(query, opts, cb);
  }

}
