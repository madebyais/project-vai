/*
*
*   config/common.js
*   Define all static configuration.
*
*/

module.exports = {
  debug: true,

  host: '0.0.0.0',
  port: 9000,

  bodyParser: {
    extended: true,
    limit: '20mb'
  }
};
