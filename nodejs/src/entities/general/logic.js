import Database from '../../cores/Database';
import async from 'async';

export default class General {

  constructor () {
    this.db = Database;
  }

  submitData (data, cb) {
    let self = this;
    let worker = [];

    data.forEach(function (item) {
      let query = `INSERT INTO tbl_data(year, income_top_10, wealth_top_10, income_bottom_50, wealth_bottom_50) VALUES(${item.year}, ${item.incometop10}, ${item.wealthtop10}, ${item.incomebottom50}, ${item.wealthbottom50})`;
      worker.push(function (cb) {
        self.db.initialize();
        self.db.raw(query, {}, cb);
      });
    });

    async.series(worker, function (err, data, fields) {
      if (err) return cb(err);
      cb(null, true);
    });
  }

  parsed (data, key) {
    let finalData = [];
    data.forEach(function (item) {
      if (item) {
        item = JSON.parse(JSON.stringify(item));
      }

      finalData.push(parseFloat(item[key]) || 0)
    });

    return finalData;
  }

  parsedJSON (data) {
    let finalData = [];
    data.forEach(function (item) {
      if (item) {
        item = JSON.parse(JSON.stringify(item));
      }

      finalData.push(item);
    });

    return finalData;
  }

  calculateGCF (a, b) {
    if (!b) {
      return a;
    }

    return this.calculateGCF(b, a % b);
  }

}
