const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nguoidungModel = require('../models/nguoidung.model');

const router = express.Router();

router.get('/register', async(req,res) => {
    res.render('viewAccount/register');
});

router.post('/register', async(req, res) => {
    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password,N);
    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const entity = req.body;

    console.log(entity);

    entity.mat_khau = hash;
    entity.quyen_han = 0; //nguoi dung binh thuong
    entity.ngay_sinh = dob;

    console.log(entity);

    delete entity.raw_password;
    delete entity.dob;
    
    const result = await nguoidungModel.add(entity);
    res.render('viewAccount/register');
});

module.exports = router;

