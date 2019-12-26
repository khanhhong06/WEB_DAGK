const express = require('express');
const sanphamModel = require('../../models/sanpham.model');

const router = express.Router();

router.get('/', (req,res)=>{
    res.render('viewAdmin/admin',{layout: false });
})

router.get('/categories/:id_loai', async (req, res) =>{
    const rows = await sanphamModel.allByCat(req.params.id_loai);

    for (const c of res.locals.lcCategories) {
        if (c.id_loai === +req.params.id_loai) {
          c.isActive = true;
          //console.log(c);
        }
    }

    res.render('viewAdmin/categories', {
        layout: false,
        categories: rows,
        empty: rows.length === 0
    });
})

/*router.get('/categories/all', async (req, res) => {
    const rows = await sanphamModel.all();
    console.log(rows);

    const c = res.locals.lcCategories;
    c.isActive = true;
    console.log(c);

    res.render('viewAdmin/categories', {
        layout: false,
        categories: rows,
        empty: rows.length === 0
    });
})*/

router.get('/categories/detail/:id', async (req, res)=>{
    const rows = await sanphamModel.single(req.params.id);
    /*if (rows.length === 0) {
        throw new Error('Invalid category id');
    }*/
    
    res.render('viewAdmin/detailCategories', {
        layout: false, 
        products: rows,
    });
})

router.post('/categories/del/:id', async(req, res) => {
    //console.log(req.params.id);
    const result = await sanphamModel.del(req.params.id);
    res.redirect(req.headers.referer);
})

router.get('/err', (req, res) => {
    throw new Error('error occured');
})

module.exports = router;