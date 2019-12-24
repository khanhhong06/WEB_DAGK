const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from nguoi_dung'),
    single: id_nguoidung => db.load(`select * from nguoi_dung where id = ${id_nguoidung}`),
    add: entity => db.add('nguoi_dung', entity),
    del: id_nguoidung => db.del('nguoi_dung', {id : id_nguoidung}),
}