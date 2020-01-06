const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nguoidungModel = require('../models/nguoidung.model');
const sanphamModel = require('../models/sanpham.model');
const xinphepUpgradeModel = require('../models/xinupgrade.model');
const restrict = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/register', async(req,res) => {
    res.render('viewAccount/register');
});

router.post('/register', async(req, res) => {
    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password,N);
    var dob = moment(req.body.dob,'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = req.body;
    //xử lý tài khoản có tồn tại hay chưa
    const user = await nguoidungModel.singleByUsername(req.body.ten_dang_nhap);
    if (user !== null)
    {
        return res.render('viewAccount/register', {
            err_message: 'Username already exists'
          })
    };
    //xử lý email đã tồn tại
    const email = await nguoidungModel.singleByEmail(req.body.email);
    if (email !== null)
    {
        return res.render('viewAccount/register', {
            err_message: 'Email already exists'
          })
    };

    console.log(entity);
    entity.mat_khau = hash;
    entity.quyen_han = 0; //nguoi dung binh thuong (bidder)
    entity.ngay_sinh = dob;

    //console.log(entity);

    delete entity.raw_password;
    delete entity.dob;
    delete entity.raw_cf_password;
    
    const result = await nguoidungModel.add(entity);

    res.render('viewAccount/register', {
        success: 'Register successful'
    });
});

router.get('/login', (req, res) => {
    res.render('viewAccount/login');
})

router.post('/login', async (req, res) => {
    const user = await nguoidungModel.singleByUsername(req.body.user);

    console.log(user);
    console.log(req.body.raw_password);

    const rs = bcrypt.compareSync(req.body.raw_password, user.mat_khau);
    if (rs === false)
      return res.render('viewAccount/login', {
        err_message: 'Invalid username or password'
      });
  
    delete user.mat_khau;
    req.session.isAuthenticated = true;
    req.session.authUser = user;
  
    const url = req.query.retUrl || '/';
    res.redirect(url);
});

router.post('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
});

router.get('/profile/:id_user', restrict, async (req, res) => {
    //lấy thông tin người dùng
    var rows = await nguoidungModel.single(req.params.id_user);

    //lấy sản phẩm yêu thích
    var farows = await sanphamModel.favourite(req.params.id_user);

    res.render('viewAccount/profile', {
        user: rows,
        empty: rows.length === 0,
        favourite: farows,
        empty_fa : farows.length === 0
    });
});

router.post('/profile/upgrade/:id', async (req, res) => {
    //thêm vào bảng xin_phep_upgrade
    const rows = await xinphepUpgradeModel.single(req.params.id);
    console.log(rows);

    if (rows.length === 0) {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
        var entity = {};
        entity.id_user = req.params.id;
        entity.ngay_dk = date;
    
        const result = await xinphepUpgradeModel.add(entity);
        console.log(result);
    }
    
    res.redirect(req.headers.referer);
})

router.get('/profile/change/:id_user', async (req, res) => {
    const row = await nguoidungModel.single(req.params.id_user);

    res.render('viewAccount/changeProfile',
    {
        info: row,
        empty: row.length
    });
})

router.post('/profile/change/:id_user', async (req, res) => {
    var row = await nguoidungModel.single(req.params.id_user);
    row = row[0];

    const entity = req.body;

    //xử lý email đã tồn tại
    const email = await nguoidungModel.singleByEmail(req.body.Email);
    console.log(email);
    if (email === null) { //ko có tài khoản nào email trùng
        row.ten = entity.Name;
        row.email = entity.Email;
        row.ngay_sinh = entity.DOB;
        const result = await nguoidungModel.patch(row);
    }
    else{//có tài khoản có email trùng
        //có phải tài khoản đang được đăng nhập hay ko
        const r = email.id === row.id;
        if (r){ // true
            row.ten = entity.Name;
            row.email = entity.Email;
            row.ngay_sinh = entity.DOB;
            const result = await nguoidungModel.patch(row);
        } else {
            return res.render('viewAccount/register', {
                err_message: 'Email already exists'
                });
        }
    }

    res.redirect(req.headers.referer);
})
  
router.get('/profile/changepass/:id_user', (req, res) => {
    res.render('viewAccount/changePass');
})

router.post('/profile/changepass/:id_user', async (req, res) => {
    var row = await nguoidungModel.single(req.params.id_user);
    row = row[0];

    const rs = bcrypt.compareSync(req.body.oldPass, row.mat_khau);
    if (rs === false)
      return res.render('viewAccount/changePass', {
        err_message: 'Invalid password'
      });

    //re === true
    console.log(req.body.newPass);

    const N=10;
    const hash = bcrypt.hashSync(req.body.newPass,N);
    console.log(hash);

    row.mat_khau = hash;

    console.log(row);

    const result = await nguoidungModel.patch(row);

    res.render('viewAccount/changePass', {
        err_message: 'Password is changed'
    });
})

module.exports = router;
