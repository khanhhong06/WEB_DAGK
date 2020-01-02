const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('viewAdmin/admin', { layout: false });
})


router.get('/err', (req, res) => {
    throw new Error('error occured');
})

router.get('/upload', (req, res) => {
    res.render('viewAdmin/uploadProducts', { layout: false });
  })
  
  router.post('/upload', async function (req, res) {
  
    const entity = req.body;
    //console.log(entity);
    var maxID = await sanphamModel.maxID();
    maxID = maxID[0].max;
    const newID = maxID + 1;
    var ID_loai = await phanloaiModel.getID_loai(entity.Type);
    ID_loai = ID_loai[0].id_loai;
    
    mkdirp(`./public/images/${newID}`, function(err) { 
      // path exists unless there was an error
    });
  
    var row = {};
    row.id = newID;
    row.ten_sp = entity.Name;
    row.gia_hien_tai = entity.CurrPrice;
    row.gia_khoi_diem = entity.BeginPrice;
    row.ngay_het_han = entity.EndTime;
    row.kich_co = entity.Size;
    row.trong_luong = entity.Weight;
    row.chung_loai = ID_loai;
    row.mo_ta = entity.FullDes;
    //const result =  await sanphamModel.add(row);
  
    upload.single('fuMain')(req, res, err => {
      if (err) { }
  
      res.send('ok');
    });
  })
  
  
module.exports = router;