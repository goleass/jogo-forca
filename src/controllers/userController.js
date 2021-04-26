const router = require('express').Router();
const BaseRepository = require('../db/pgRepository');

router.get('/', async (req, res) => {
    try {
        const con = new BaseRepository()

        const users = await con.getUsers('usuarios')

        return res.send(users)
    } catch (error) {
        console.log(error)
        res.send({ error: "Erro ao consultar usuários." })
    }
})

router.post('/new-user', async (req, res) => {
    try {
        const con = new BaseRepository()

        if (!req.body || !req.body.nome_usuario || !req.body.usuario || !req.body.senha) {
            return res.send({ error: "Campos inválidos." })
        }

        const {
            nome_usuario,
            usuario,
            senha } = req.body;

        const user = await con.create({
            nome_usuario,
            usuario,
            senha
        }, 'usuarios')

        if (!user) {
            res.send({ error: "Não foi possível criar novo usuário." })
            console.log('Erro banco userController.')
        }

        return res.send({ nome_usuario: user.nome_usuario, usuario: user.usuario } || []);
    } catch (error) {
        console.log('Erro ao criar usuario.')
        return res.send({ error: "Erro ao criar usuario." })
    }
})

router.delete('/remove-user/', async (req, res) => {
    try {
        const { id } = req.query

        if (!id) return res.send({ error: "Campo id é indefinido." })

        const con = new BaseRepository()

        let r = await con.removeUser(id)

        return res.send({ status: true })

    } catch (error) {
        res.send(error)
    }
})

router.put('/edit-user', async (req, res) => {
    try {
        const { id } = req.query

        const {
            nome_usuario,
            usuario,
            senha } = req.body;

        if (!id || !nome_usuario || !usuario || !senha) return res.send({ error: "Todos os campos precisam ser preenchidos." })

        const con = new BaseRepository()

        let user = await con.updateUser({ pk_cod_usuario: id, nome_usuario, usuario, senha })

        return res.send(user)

    } catch (error) {
        res.send(error)
    }
})

module.exports = app => app.use('/users', router);