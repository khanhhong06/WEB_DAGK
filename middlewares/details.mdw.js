const productsModels = require('../models/sanpham.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await productsModels.all();
    res.locals.dtProducts = rows;
    next();
  })
};
