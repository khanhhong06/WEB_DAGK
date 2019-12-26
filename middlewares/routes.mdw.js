module.exports = function (app) {
    app.use('/', require('../routes/home.route'));
    app.use('/account', require('../routes/account.route'));
    app.use('/products', require('../routes/products.route'));
    app.use('/admin', require('../routes/admin/admin.route'));
  };
  
  