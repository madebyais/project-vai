import error from '../../config/error';
import Multer from 'multer';
import CsvJson from 'convert-csv-to-json';

let multer = Multer({ dest: './upload/' });

class File {

  /*
  *   upload
  *   This method is use to upload a csv file
  */

  upload (req, res, next) {
    multer.single('csvfile')(req, res, next);
  }

  /*
  *   checkCsv
  *   This method is use to check whether the file is in csv format
  */

  checkCsv (req, res, next) {
    if (!req.file || (req.file && !req.file.mimetype))
      return res.status(500).json({ status: 'error', message: error[50010] });

    if (req.file && req.file.mimetype && req.file.mimetype != 'text/csv')
      return res.status(500).json({ status: 'error', message: error[50011] });

    req.pipa.file = `${__dirname}/../../upload/${req.file.filename}`;
    next();
  }

  /*
  *   convertToJson
  *   This method is use to convert csv to json format
  */

  convertToJson (req, res, next) {
    let data = CsvJson.getJsonFromCsv(req.pipa.file);
    req.pipa.dataJson = data;
    next();
  }

}

module.exports = new File();
