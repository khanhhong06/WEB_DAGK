const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from san_pham'),
    single: id => db.load(`select * from san_pham where id = ${id}`),
    allByCat: id_loai => db.load(`select * from san_pham where chung_loai = ${id_loai}`),
    add: entity =>db.add('san_pham', entity),
    del: id => db.del('san_pham',{ID: id}),
    patch: entity => {
        const condition = { ID: entity.ID};
        delete entity.ID;
        return db.patch('san_pham',entity,condition);
    }
}