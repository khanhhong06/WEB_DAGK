const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from products'),
    single: id => db.load(`select * from products where ID = ${id}`),
    add: entity =>db.add('products', entity),
    del: id => db.del('products',{ID: id}),
    patch: entity => {
        const condition = { ID: entity.ID};
        delete entity.ID;
        return db.patch('products',entity,condition);
    }
}