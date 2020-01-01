const express = require('express');
const yeuthichModel = require('../models/yeuthich.model');
const nguoidungModel  = require('../models/nguoidung.model');
const Swal = require('sweetalert2');

const router = express.Router();

router.post('/:id_sp', async (req, res) =>{
    //nếu chưa login, chuyển qua màn hình login
    if (req.session.isAuthenticated === false){
        res.render('viewAccount/login');
    } 
    else{
        //đã login (user chưa thêm sp đó thành yêu thích)
        //lấy id user hiện tại
        const user_id = req.session.authUser.id;
        //lấy id sản phẩm
        const sp_id = req.params.id_sp;
        
        var entity = {};
        entity.id_user = user_id;
        entity.id_sp = sp_id;
        const result = await yeuthichModel.add(entity);

        Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'Cool'
          });
        //res.redirect(req.headers.referer);
    }
})

router.get('/err', (req, res) => {

    throw new Error('error occured');
  
})

module.exports = router;
