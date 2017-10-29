const common = require('./config/common');

if (common.debug) console.time(`start_app`);

require('babel-polyfill');
require('babel-register');
((require('./env') === 'development') ?
  require('./src/server') :
  require('./dist/server')).init(require('./env'))

if (common.debug) console.timeEnd(`start_app`);
