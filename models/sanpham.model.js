const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load(`select * from san_pham`),
    single: id => db.load(`select * from san_pham where id = ${id}`),
    allByCat: id_loai => db.load(`select * from san_pham where chung_loai = '${id_loai}'`),
    countByCat: async id_loai => {
        const rows = await db.load(`select count(*) as total from san_pham where chung_loai = ${id_loai}`)
        return rows[0].total;
    },
    pageByCat: (id_loai,offset) => db.load(`select * from san_pham where chung_loai = ${id_loai} limit ${config.paginate.limit} offset ${offset}`),
    add: entity =>db.add('san_pham', entity),
    del: id => db.del('san_pham',{ID: id}),
    patch: entity => {
        const condition = { id: entity.id};
        delete entity.id;
        return db.patch('san_pham',entity,condition);
    },

    maxID: () => db.load('select max(id) as max from san_pham'),
    topbid:()=> db.load(`SELECT sp.*,COUNT(ctrg.san_pham_id) AS TOTAL FROM san_pham AS sp JOIN chi_tiet_ra_gia AS ctrg ON sp.id=ctrg.san_pham_id GROUP BY ctrg.san_pham_id ORDER BY TOTAL DESC LIMIT 5 `),
    //topbid:() => db.load(`select * from san_pham`),

    search:async(inputSearch,searchType)=>{ 
        let rows;
        if (searchType=='0'){
            console.log(inputSearch);
            rows= await db.load(`select * from san_pham where ten_sp like '%${inputSearch}%'`)
        }
        else {
            rows= await db.load(`select * from san_pham where ten_sp like '%${inputSearch}%' and chung_loai = '${searchType}'`)
        }
        return rows;
    },

    favourite: (user) => db.load(`select * from san_pham join yeu_thich on id = id_sp and id_user = '${user}'`),

    bidder:(id)=>db.load(`select ten_dang_nhap, gia,thoi_diem_ra_gia from chi_tiet_ra_gia AS ctrg JOIN nguoi_dung nd ON ctrg.nguoi_dung_id=nd.id where ctrg.san_pham_id='${id}'`),

    updatePrice: entity =>{
        const condition = { ID: entity[0].id};
        delete entity[0].id;
        return db.patch('san_pham',entity[0],condition);
    }
}