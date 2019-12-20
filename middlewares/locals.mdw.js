const categoryModel = require('../models/phanloai.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await categoryModel.all();
    res.locals.lcCategories = rows;
    next();
  })
};
