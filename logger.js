const datemaker = require('datemaker');

const logger = {
  log(req, res, next) {
    console.log(`${req.method} ${req.path} ${req.ip} - ${datemaker.local()}`);
    next();
  },

  handleError(err, req, res, next) {
    console.log(err);
    res.status(500).send('errors ahoy');
  }
};

module.exports = logger;