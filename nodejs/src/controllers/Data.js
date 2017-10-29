import error from '../../config/error';
import async from 'async';

import General from '../entities/general/logic';
import Income from '../entities/income/logic';
import Wealth from '../entities/wealth/logic';

import regression from 'regression';

class Data {

  /*
  *   cleanCsv
  *   This method is use to clean the string content
  *   from \r.
  */

  cleanCsv (req, res, next) {
    req.pipa.dataJson.forEach(function (item) {
      for (var key in item) {
        if (key != 'year') {
          let tempVal = item[key].replace(/\r/, '');
          item[key] = parseFloat(tempVal)
        } else {
          item[key] = parseInt(item[key])
        }
      }
    });

    next();
  }

  /*
  *   importFile
  *   This method is use to import the data in the file
  *   and insert into database.
  */

  importFile (req, res, next) {
    let general = new General();

    general.submitData(req.pipa.dataJson, function (err, resData, fields) {
      if (err) return res.status(500).json({ status: 'error', message: error[50030] });

      req.pipa.statusCode = 200;
      req.pipa.data = {
        message: 'Data have been imported.'
      };
      next();
    });
  }

  /*
  *   checkQueryParams
  *   This method is use to check query parameter for each api
  */

  checkQueryParams (req, res, next) {
    if (!req.query.init || !req.query.end)
      return res.status(400).json({ status: 'error', message: error[40010] })

    if (parseInt(req.query.init) > parseInt(req.query.end))
      return res.status(400).json({ status: 'error', message: error[40012] })

    req.pipa.initYear = req.query.init;
    req.pipa.endYear = req.query.end;

    next();
  }

  /*
  *   checkQueryParams
  *   This method is use to check body/json parameter for each api
  */

  checkJsonParams (req, res, next) {
    if (!req.body.group || !req.body.init || !req.body.end)
      return res.status(400).json({ status: 'error', message: error[40011] });

    if (parseInt(req.body.init) > parseInt(req.body.end))
      return res.status(400).json({ status: 'error', message: error[40012] })

    req.pipa.initYear = req.body.init;
    req.pipa.endYear = req.body.end;

    next();
  }

  /*
  *   getTop10IncomeAndWealth
  *   This method is use to get income and wealth for
  *   `top-10` or `bottom-50`
  */

  getIncomeAndWealth (req, res, next) {
    let general = new General();
    let income = new Income();
    let wealth = new Wealth();

    let initYear, endYear;
    try { initYear = parseInt(req.pipa.initYear); } catch (e) { initYear = 1962; }
    try { endYear = parseInt(req.pipa.endYear); } catch (e) { endYear = 2014; }

    let path = req.url.toString().split('?')[0].replace('/api/', '');

    async.parallel({
      incomeData: function (cb) {
        income.get(path, initYear, endYear, cb);
      },
      wealthData: function (cb) {
        wealth.get(path, initYear, endYear, cb);
      },
    }, function (err, asyncData) {
      if (err) return res.status(500).json({ status: 'error', message: error[50000], err: err });

      let finalYear = [];

      while (initYear <= endYear) {
        finalYear.push(initYear);
        initYear++;
      }

      let data = {
        year: finalYear,
        income: [],
        wealth: []
      };

      if (path.indexOf('top') < 0 && path.indexOf('bottom')) {
        req.pipa.data = {
          year: data.year,
          income: general.parsedJSON(asyncData.incomeData[0]),
          wealth: general.parsedJSON(asyncData.wealthData[0])
        }
        return next();
      }

      if (asyncData.incomeData.length > 0) {
        let key = (path.indexOf('top') > -1) ? 'income_top_10' : 'income_bottom_50';
        data.income = general.parsed(asyncData.incomeData[0], key);
      }

      if (asyncData.wealthData.length > 0) {
        let key = (path.indexOf('top') > -1) ? 'wealth_top_10' : 'wealth_bottom_50';
        data.wealth = general.parsed(asyncData.wealthData[0], key);
      }

      req.pipa.statusCode = 200;
      req.pipa.data = data;
      next();
    });
  }

  /*
  *   calculateGreatestCommonFactors
  *   This method is use to calculate the GFC of income and wealth
  */

  calculateGreatestCommonFactors (req, res, next) {
    let general = new General();

    let entity = (req.url.indexOf('wealth') > -1) ? 'wealth' : 'income';
    let data = {
      year: req.pipa.data.year,
      factor: []
    };

    let temp = {};
    temp[entity] = req.pipa.data[entity];

    let tempDataPerYear = {}
    temp[entity].forEach(function (item) {
      if (!tempDataPerYear[item.year])
        tempDataPerYear[item.year] = item;
    });

    let finalFactorData = [];

    data.year.forEach(function (y) {
      let gcf = general.calculateGCF(tempDataPerYear[y][entity + '_bottom_50'], tempDataPerYear[y][entity + '_top_10']);
      finalFactorData.push(gcf);
    });

    data.factor = finalFactorData;

    req.pipa.statusCode = 200;
    req.pipa.data = data;
    next();
  }

  /*
  *   savingCapacity
  *   This method is use to calculate saving capacity
  */

  savingCapacity (req, res, next) {
    let income = {}, wealth = {};
    req.pipa.data.income.forEach(function (item) {
      if (item && item.year) income[item.year] = item;
    });
    req.pipa.data.wealth.forEach(function (item) {
      if (item && item.year) wealth[item.year] = item;
    });

    let period = [];
    let finalData = {};

    for (var i = 0;i<req.pipa.data.year.length;i++) {
      var j = i + 1;

      if (req.pipa.data.year[j]) {
        period.push([
          req.pipa.data.year[i],
          req.pipa.data.year[j]
        ]);
      }

      finalData[req.pipa.data.year[i]] = {
        income: income[req.pipa.data.year[i]],
        wealth: wealth[req.pipa.data.year[i]]
      };
    }

    let savingCapacity = [];
    let entity = req.body.group;
    let key = (entity.toString() == '10') ? 'wealth_top_10' : 'wealth_bottom_50';
    let keyIncome = (entity.toString() == '10') ? 'income_top_10' : 'income_bottom_50';

    period.forEach(function (p) {
      let x = p[0], y = p[1];
      let total = (finalData[p[1]].wealth[key] - finalData[p[0]].wealth[key]) / finalData[p[0]].income[keyIncome];

      savingCapacity.push(total);
    });

    req.pipa.statusCode = 200;
    req.pipa.data = {
      period: period,
      savingCapacity: savingCapacity
    };
    next();
  }

  setInitAndEndYear (req, res, next) {
    req.pipa.initYear = 1962;
    req.pipa.endYear = 2014;

    next();
  }

  predict (req, res, next) {
    let data = req.pipa.data;
    let entity = (req.url.indexOf('wealth') > -1) ? 'wealth' : 'income';
    let group = (req.body && req.body.group && req.body.group.toString() == '10') ? `${entity}_top_10` : `${entity}_bottom_50` ;

    let finalData = [];
    data[entity].forEach(function (item) {
      finalData.push([
        item.year, item[group]
      ]);
    });

    const result = regression.linear(finalData);

    let years = req.body.years || 1;
    let prediction = [];

    for(var i=1;i<=years;i++) {
      let year = 2014 + i;
      prediction.push(result.predict(year)[1]);
    }

    req.pipa.statusCode = 200;
    req.pipa.data = {
      group: req.body.group,
      prediction: prediction
    };
    next();
  }

}

module.exports = new Data();
