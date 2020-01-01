const express = require('express');
const productsModel = require('../models/sanpham.model');
const config = require('../config/default.json');

const router = express.Router();

// trang chu

router.get('/', async(req, res) => {
    const rows = await productsModel.all();
    res.render('viewHome/index', {
        products: rows,
        empty: rows.length === 0
    });
}) 

router.post('/:string',async(req,res)=>{
  const rows=await productsModel.search(req.body.inputSearch);
  res.render('viewSearch/searchbody',{
    products: rows,
    empty: rows.length===0
  });
})

// xem ds sản phẩm thuộc danh mục :id

router.get('/:id_loai/products', async (req, res) => {

  for (const c of res.locals.lcCategories) {
    //console.log(c);
    if (c.id_loai === +req.params.id_loai) {
      c.isActive = true;
    }
  }

  const catId = req.params.id_loai;
  const limit = config.paginate.limit;

  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;

  const [total, rows] = await Promise.all([
    productsModel.countByCat(catId),
    productsModel.pageByCat(catId, offset)
  ]);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

  res.render('viewProducts/products', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
  });
  /*
  const rows = await productsModel.allByCat(req.params.id_loai);
  res.render('viewProducts/products', {
    products: rows,
    empty: rows.length === 0
  });
  */
})

// xem chi tiet tung san pham theo id san pham

router.get('/:id/detailproduct', async(req,res) => {
  //console.log(req.params.id);

  const rows = await productsModel.single(req.params.id);
  res.render('viewProducts/products_detail', {
    products: rows,
    empty: rows.length === 0
  })
})

//bat loi

router.get('/err', (req, res) => {

    throw new Error('error occured');
  
})


module.exports = router;
  