const router = require('express').Router();
const BaseRepository = require('../db/pgRepository');

router.get('/', async (req, res) => {
    try {
        const con = new BaseRepository()

        const categories = await con.getAll('categorias')

        return res.send(categories)
    } catch (error) {
        console.log(error)
        res.send({ error: "Erro ao consultar categorias." })
    }
})

router.post('/new-category', async (req, res) => {
    try {
        const con = new BaseRepository()

        if (!req.body.nome_categoria) {
            return res.send({ error: "Campos inválidos." })
        }

        const { nome_categoria } = req.body;

        const category = await con.create({
            nome_categoria: nome_categoria.toUpperCase()
        }, 'categorias')

        if (!category) {
            res.send({ error: "Não foi possível criar nova categoria." })
            console.log('Erro banco.')
        }

        return res.send({ category } || []);
    } catch (error) {
        console.log('Erro ao criar categoria.')
        return res.send({ error: "Erro ao criar categoria." })
    }
})

router.delete('/remove-category', async (req, res) => {
    try {
        const { id } = req.query

        if (!id) return res.send({ error: "Campo id é indefinido." })

        const con = new BaseRepository()

        let r = await con.removeCategory(id)

        return res.send({ status: true })

    } catch (error) {
        res.send(error)
    }
})

router.put('/edit-category', async (req, res) => {
    try {
        const { id } = req.query

        const { nome_categoria } = req.body;

        if (!nome_categoria) return res.send({ error: "Todos os campos precisam ser preenchidos." })

        const con = new BaseRepository()

        let category = await con.updateCategory({ pk_cod_categoria: id, nome_categoria: nome_categoria.toUpperCase() })

        return res.send(category)

    } catch (error) {
        res.send(error)
    }
})

module.exports = app => app.use('/categories', router);