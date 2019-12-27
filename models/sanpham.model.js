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
}