const express = require('express');
const sanphamModel = require('../../models/sanpham.model');
const config = require('../../config/default.json');
const multer = require('multer');

const router = express.Router();

router.get('/', (req,res)=>{
    res.render('viewAdmin/admin',{layout: false });
})

//XU LY CAC THAO TAC QUAN LY SAN PHAM: xem chi tiet, xoa, chinh sua

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

router.post('/categories/del/:id', async (req, res) => {
    const PORT = config.host.port;
    const row =  await sanphamModel.single(req.params.id);
    const id_loai = row[0].chung_loai;
    const referer = `http://localhost:${PORT}/admin/categories/${id_loai}`;
    const result = await sanphamModel.del(req.params.id);
    res.redirect(referer);
})

router.get('/categories/edit/:id', async (req, res) => {
    const rows = await sanphamModel.single(req.params.id);
    res.render('viewAdmin/editProducts', {
        layout: false,
        products: rows,
        empty: rows.length === 0
    });
})

router.post('/categories/edit/:id', async function(req, res) {    
    const entity = req.body;
    //console.log(entity);
    var row = await sanphamModel.single(req.params.id);
    row = row[0];
    row.ten_sp = entity.Name;
    row.gia_hien_tai = entity.CurrPrice;
    row.gia_khoi_diem = entity.BeginPrice;
    row.ngay_het_han = entity.EndTime;
    row.kich_co = entity.Size;
    row.trong_luong = entity.Weight;
    row.mo_ta = entity.FullDes;
    
    const result = await sanphamModel.patch(row);
    //console.log(result);
    res.redirect(req.headers.referer, {layout: false});
})

router.get('/err', (req, res) => {
    throw new Error('error occured');
})

module.exports = router;