const express = require('express');
const yeuthichModel = require('../models/yeuthich.model');
const productsModel = require('../models/sanpham.model');
const bidModel = require('../models/chitietragia.model');
const moment = require('moment');

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
router_Products.post('/:id/:crprice/bid', async (req,res) =>{

  const status =  req.session.isAuthenticated;

  console.log(status);

  if (status === false) {
    return res.render('viewAccount/login');
  }

  var productid = req.params.id;
  var currentprice = req.params.crprice;
  var bidprice = req.body.gia_dau;

  //Gia bid thap
  //Can sua currentprice thanh currentprice+ buoc gia
  if(parseInt(bidprice) <= parseInt(currentprice))
  {
    return res.render('viewProducts/products_detail',{
      err_message: `Your bid price must be higher than ${currentprice}`,
    });
  }

  //Bid thanh cong
  const entity = req.body;

  entity.san_pham_id = req.params.id;
  entity.nguoi_dung_id = req.session.authUser.id;
  entity.gia =req.body.gia_dau;
  entity.thoi_diem_ra_gia = moment().format('YYYY-MM-DD HH:mm:ss');

  delete entity.gia_dau;

  //Them vao danh sach bid (chi_tiet_ra_gia)
  bidModel.add(entity);

  //Cap nhat lai gia hien tai
  const en_sanpham = await productsModel.single(productid);
  en_sanpham[0].gia_hien_tai = bidprice;
  productsModel.updatePrice(en_sanpham);

  //Chuyen den trang bao thanh cong
  res.redirect(req.headers.referer);

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