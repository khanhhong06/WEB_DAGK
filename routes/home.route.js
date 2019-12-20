const express = require('express');
const productsModel = require('../models/sanpham.model');

const router = express.Router();

// trang chu

router.get('/', async(req, res) => {
    const rows = await productsModel.all();
    res.render('viewHome/index', {
        products: rows,
        empty: rows.length === 0
    });
}) 

// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/products', async (req, res) => {

  for (const c of res.locals.lcCategories) {
    //console.log(c);
    if (c.id_loai === +req.params.id) {
      c.isActive = true;
    }
  }

  const rows = await productsModel.allByCat(req.params.id);
  res.render('viewProducts/products', {
    products: rows,
    empty: rows.length === 0
  });
})

//bat loi

router.get('/err', (req, res) => {

    throw new Error('error occured');
  
})


module.exports = router;
  