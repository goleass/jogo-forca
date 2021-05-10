const router = require('express').Router();
const BaseRepository = require('../db/pgRepository');

router.get('/', async (req, res) => {
    try {
        const con = new BaseRepository()

        let ranking = await con.fetchRow(`
        SELECT * FROM ranking ORDER BY score desc LIMIT 10`)

        ranking = ranking.map(r => {
            let data = new Date(r.data);
            const newDate = ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()
            return { nome_ranking: r.nome_ranking, score: r.score, data: newDate }
        })

        return res.send(ranking)
    } catch (error) {
        console.log(error)
        res.send({ error: "Erro ao consultar ranking." })
    }
})

router.post('/new-ranking', async (req, res) => {
    try {
        const con = new BaseRepository()

        if (!req.body.nome_ranking || !req.body.score) {
            return res.send({ error: "Campos inválidos." })
        }

        const { nome_ranking, score } = req.body;

        const ranking = await con.create({
            nome_ranking, 
            score
        }, 'ranking')
        if (!ranking) {
            res.send({ error: "Não foi possível criar novo ranking." })
            console.log('Erro banco.')
        }

        return res.send({ ranking } || []);
    } catch (error) {
        console.log('Erro ao criar ranking.')
        return res.send({ error: "Erro ao criar ranking." })
    }
})

module.exports = app => app.use('/ranking', router);