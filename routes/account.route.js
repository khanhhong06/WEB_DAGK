const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nguoidungModel = require('../models/nguoidung.model');
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

    console.log(user);

    if (user !== null)
    {
      return res.render('viewAccount/register', {
        err_message: 'User already exists'
      });
    }

    console.log(entity);

    entity.mat_khau = hash;
    entity.quyen_han = 0; //nguoi dung binh thuong (bidder)
    entity.ngay_sinh = dob;

    console.log(entity);

    delete entity.raw_password;
    delete entity.dob;
    
    const result = await nguoidungModel.add(entity);

    res.render('viewAccount/register',{
      success: 'Register successfully'
    });
});

router.get('/login', (req, res) => {
    res.render('viewAccount/login');
})

router.post('/login', async (req, res) => {
    const user = await nguoidungModel.singleByUsername(req.body.user);

    console.log(user);

    if (user === null)
      throw new Error('Invalid username or password.');

    console.log(req.body.raw_password);

  
    const rs = bcrypt.compareSync(req.body.raw_password, user.mat_khau);
    if (rs === false)
      return res.render('viewAccount/login', {
        err_message: 'Login failed'
      });
  
    delete user.mat_khau;
    req.session.isAuthenticated = true;
    req.session.authUser = user;
  
    const url = req.query.retUrl || '/';
    res.redirect(url);
})

router.post('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
});

router.get('/profile/:id_user', restrict, async (req, res) => {
    const rows = await nguoidungModel.single(req.params.id_user);
    res.render('viewAccount/profile', {
        user: rows,
        empty: rows.length === 0
    });
});
  
  
module.exports = router;

