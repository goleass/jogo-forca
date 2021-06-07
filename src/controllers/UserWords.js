const router = require('express').Router();
const BaseRepository = require('../db/pgRepository');

router.get('/', async (req, res) => {
    try {
        const con = new BaseRepository()

        const words = await con.getAll('palavras', 'categorias', 'fk_cod_categoria', 'pk_cod_categoria')

        return res.send(words)
    } catch (error) {
        console.log(error)
        res.send({ error: "Erro ao consultar palavras." })
    }
})

router.get('/get-word', async (req, res) => {
    try {
        const { dificuldade, categoria } = req.query

        if (!dificuldade || !categoria) return res.send({ error: "Todos os campos precisam ser definidos." })

        const con = new BaseRepository()

        const words = await con.getAll(
            'palavras',
            'categorias',
            'fk_cod_categoria',
            'pk_cod_categoria',
            [
                { column: 'dificuldade', value: dificuldade },
                { column: 'pk_cod_categoria', value: categoria }
            ])

        radom = (max, min) => {
            let valor = Math.random() * (max - min) + min
            return Math.floor(valor)
        }

        const word = words[radom(words.length, 0)]

        return res.json(word.nome_palavra)

    } catch (error) {
        res.send(error)
    }
})

router.get('/get-word-name', async (req, res) => {
    try {
        const { nome_palavra } = req.query

        if (!nome_palavra ) return res.send({ error: "Todos os campos precisam ser definidos." })

        const con = new BaseRepository()

        const word = await con.getAll(
            'palavras', null, null, null,
            [{ column: 'nome_palavra', value: `'${nome_palavra}'` }])

        return res.json({word: word[0]})

    } catch (error) {
        res.send(error)
    }
})

router.post('/new-word', async (req, res) => {
    try {
        const con = new BaseRepository()

        if (!req.body.nome_palavra && !req.body.dificuldade && !req.body.fk_cod_categoria) {
            return res.send({ error: "Campos inválidos." })
        }

        const { nome_palavra, dificuldade, fk_cod_categoria } = req.body;

        const word = await con.create({
            nome_palavra: nome_palavra.toUpperCase(), dificuldade, fk_cod_categoria
        }, 'palavras')

        if (!word) {
            res.send({ error: "Não foi possível criar nova palavra." })
            console.log('Erro banco.')
        }

        return res.send({ word } || []);
    } catch (error) {
        console.log('Erro ao criar palavra.')
        return res.send({ error: "Erro ao criar palavra." })
    }
})

router.delete('/remove-word', async (req, res) => {
    try {
        const { id } = req.query

        if (!id) return res.send({ error: "Campo id é indefinido." })

        const con = new BaseRepository()

        let r = await con.removeWord(id)

        return res.send({ status: true })

    } catch (error) {
        res.send(error)
    }
})

router.put('/edit-word', async (req, res) => {
    try {
        const { id } = req.query

        const { nome_palavra, dificuldade, fk_cod_categoria } = req.body;

        if (!req.body.nome_palavra && !req.body.dificuldade && !req.body.fk_cod_categoria) return res.send({ error: "Todos os campos precisam ser preenchidos." })

        const con = new BaseRepository()

        let word = await con.updateWord({ pk_cod_palavra: id, nome_palavra: nome_palavra.toUpperCase(), dificuldade, fk_cod_categoria })

        return res.send(word)

    } catch (error) {
        res.send(error)
    }
})

module.exports = app => app.use('/words', router);