const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from phan_loai'),
    single: id_loai => db.load(`select * from phan_loai where id_loai = ${id_loai}`)
}