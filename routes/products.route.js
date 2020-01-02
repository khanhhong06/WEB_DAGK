const express = require('express');
const yeuthichModel = require('../models/yeuthich.model');
const productsModel = require('../models/sanpham.model');

const router_Products = express.Router();

router_Products.get('/:id/detailproduct', async(req,res) => {
  //console.log(req.params.id);

  const rows = await productsModel.single(req.params.id);
  res.render('viewProducts/products_detail', {
    products: rows,
    empty: rows.length === 0
  })
})

//Xy ly bid (chua xong)
router_Products.post('/bid/:id', async (req,res) =>{

  var price= req.body.gia_dau;
  var currentprice = req.body.gia_hien_tai;
  console.log(price);
  console.log(currentprice)

})

//xu ly nhan button 'Yeu Thich' van chua duoc

router_Products.post('/:id/detailproduct', async (req, res) => {

   const status =  req.session.isAuthenticated;

    console.log(status);

   if (status === false) {
     return res.render('viewAccount/login');
   }
   // true 
   const user =  req.session.authUser.id;

   console.log(user);

   const product = req.params.id; 

   console.log(product);

   const entity = {user, product};

   console.log(entity);

   const result = await yeuthichModel.add(entity);
   res.redirect(req.headers.referer);
})

router_Products.get('/err', (req, res) => {

    throw new Error('error occured');
})

module.exports = router_Products;