const express = require('express');
const productsModel = require('../models/sanpham.model');

const router_Products = express.Router();

// xem ds sản phẩm thuộc danh mục :id
/*
router_Products.get('/:id/products', async (req, res) => {

  for (const c of res.locals.lcCategories) {
    console.log(c);
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

// xem chi tiet tung san pham theo id san pham

router_Products.get('/:id/detail_product', async(req,res) => {

  const rows = await productsModel.single(req.params.id);
  res.render('viewProducts/products_detail', {
    products: rows,
    empty: rows.length === 0
  })
})
*/
router_Products.get('/err', (req, res) => {

    throw new Error('error occured');
})

module.exports = router_Products;