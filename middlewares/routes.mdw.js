module.exports = function (app) {
    app.use('/', require('../routes/home.route'));
    //app.use('/',require('../routes/products.route'));
    //app.use('/admin/categories', require('../routes/admin/category.route'));
    app.use('/account', require('../routes/account.route'));
  };
  
  