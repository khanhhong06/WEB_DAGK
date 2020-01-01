const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nguoidungModel = require('../models/nguoidung.model');
const restrict = require('../middlewares/auth.mdw');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get('/register', async(req,res) => {
    res.render('viewAccount/register');
});

router.post('/register', async (req, res)=> {

/*[
    check('email').isEmail().withMessage("Invalid Email")
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //Kiểm tra rỗng
    if(req.body.ten_dang_nhap == "" || req.body.raw_password == "" || req.body.ten == "")
    {
        throw new Error('Fill all the information');
        return;
    }

    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password,N);
    var dob = moment(req.body.dob,'DD/MM/YYYY')
    //Kiem tra ngày tháng hợp lệ
    if(!dob.isValid())
    {
        throw new Error('Invalid date of birth');
        return;
    }
*/
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
    if (user !== null)
    {
        return res.render('viewAccount/register', {
            err_message: 'Email already exists'
          })
    };
    //console.log(entity);
    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password,N);
    entity.mat_khau = hash;
    entity.quyen_han = 0; //nguoi dung binh thuong (bidder)
    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    entity.ngay_sinh = dob;

    //console.log(entity);

    delete entity.raw_password;
    delete entity.dob;
    
    const result = await nguoidungModel.add(entity);

    res.render('viewAccount/register', {
        err_message: 'Register successful'
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

