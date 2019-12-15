const express = require('express');
const productsModel = require('../../models/products.model');

const router = express.Router();

router.get('/', async(req, res) => {
    const rows = await productsModel.all();
    res.render('viewHome/index', {
        products: rows,
        empty: rows.length === 0
    });
}) 

//router.get('/products', (req,res) => {
   // res.render('viewProducts/products');
//})

router.get('/err', (req, res) => {

    throw new Error('error occured');
  
    // try {
    //   throw new Error('error occured');
    // }
    // catch (err) {
    //   console.log(err.stack);
    //   res.send('View error on console');
    // }
})

module.exports = router;
  