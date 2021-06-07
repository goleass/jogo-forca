const router = require('express').Router();
const bcryt = require('bcryptjs')
const BaseRepository = require('../db/pgRepository');

router.post('/auth', async (req, res) => {
  try {

    if (!req.body.usuario && !req.body.senha) {
      return res.send({ error: "Campos inválidos." })
    }

    const con = new BaseRepository()

    const { senha, usuario } = req.body;

    const user = await con.getAll(
      'usuarios', null, null, null,
      [{ column: 'usuario', value: `'${usuario}'` },
      { column: 'senha', value: `'${senha}'` }])

    if(user.length > 0) {
      const a = user[0]
      return res.send({...a, token:"2121212121212"});
    }

    return res.send(null);
  } catch (error) {
    console.log('Erro ao criar usuario.')
    return res.send({ error: "Erro ao criar usuario." })
  }
})

module.exports = app => app.use('/authenticate', router);