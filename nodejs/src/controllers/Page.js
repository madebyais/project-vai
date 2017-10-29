import General from '../entities/general/logic';
import Income from '../entities/income/logic';

import regression from 'regression';

class Page {

  constructor () {}

  homepage (req, res, next) {
    res.render('index');
  }

  redirectHomepage (req, res, next) {
    res.redirect('/?status=success');
  }

}

module.exports = new Page();
