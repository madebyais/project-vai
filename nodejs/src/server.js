import COMMON_CONFIG from '../config/common';
import Express from './cores/express';
import Database from './cores/database';
import Pipa from 'pipa';

class Server {

  constructor () {
    this.app = new Express();
  }

  init (ENV) {
    Database.initialize();
    Database.migrate();

    const dirpath = (ENV === 'development') ? `./src` : `./dist`
    const pipa = new Pipa(this.app.e, `${dirpath}/routes`, `${dirpath}/controllers`);
    pipa.open();

    this.app.e.listen(`${COMMON_CONFIG.port}`);

    console.log(`
      ----

      Application listened at :${COMMON_CONFIG.port}

      ----
    `)
  }

}

module.exports = new Server();
