/*
*
* @cores/express.js
* This file contain the core function
* to setup the basic config of expressjs
* that will be used by ais-js.
*
*/

import COMMON_CONFIG from '../../config/common';
import express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import ejs from 'ejs';
import helmet from 'helmet';

export default class Express {

  constructor () {
    this.e = express();

    this.e.engine('html', ejs.renderFile);
    this.e.use(express.static(__dirname + '/../../views'));

    this.e.use(bodyParser.json(COMMON_CONFIG.bodyParser));
    this.e.use(bodyParser.urlencoded(COMMON_CONFIG.bodyParser));
    this.e.use(compression());
    this.e.use(helmet());
    this.e.use(cors());
  }

}
