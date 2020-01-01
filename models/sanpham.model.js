const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load('select * from san_pham'),
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
        const condition = { ID: entity.id};
        delete entity.id;
        return db.patch('san_pham',entity,condition);
    },

    maxID: () => db.load('select max(id) as max from san_pham'),

    search:inputSearch=>db.load(`select * from san_pham where ten_sp like '%${inputSearch}%'`),
    searchType:async(inputSearch,searchType)=>{ 
        const rows;
        if (searchType=='1'){
            console.log("1");
            rows= await db.load(`select * from san_pham where ten_sp like '%${inputSearch}%'`)
        }
        else if (searchType=='2'){
            console.log("2");
            rows= await db.load(`select * from san_pham where ten_sp like '%${inputSearch}%' and chung_loai = ${searchType}`)
        }
        else if (searchType=='3'){
            console.log("3");
            rows= await db.load(`select * from san_pham where gia_hien_tai <= ${inputSearch}`)
        }
        console.log(rows);
        return rows[0];
    }
}