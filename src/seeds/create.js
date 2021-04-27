const slq = require('../_util/create')
const BaseRepository = require('../db/pgRepository');

const con = new BaseRepository()

con.fetchRow(slq)
    .then(r => console.log(r))
    .catch(e => console.log(e))