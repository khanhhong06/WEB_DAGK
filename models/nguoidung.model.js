const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from nguoi_dung'),
    single: id_nguoidung => db.load(`select * from nguoi_dung where id = ${id_nguoidung}`),
    singleByUsername: async username => {
        const rows = await db.load(`select * from nguoi_dung where ten_dang_nhap = '${username}'`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },
    add: entity => db.add('nguoi_dung', entity),
    del: id_nguoidung => db.del('nguoi_dung', {id : id_nguoidung}),
}