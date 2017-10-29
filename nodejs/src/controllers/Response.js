/*
*   Response.js
*   This class define the output
*/

class Response {
  constructor () {}

  /*
  *   json
  *   This method is use to response in JSON format
  */

  json (req, res, next) {
    res
      .status(req.pipa.statusCode)
      .json({ data: req.pipa.data });
  }

}

module.exports = new Response();
