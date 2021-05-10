const { Client } = require('pg');
const withQuotes = require('../_util/withQuotes');

class BaseRepository {

    // host = process.env.DATABASE_URL || 'localhost'

    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }

    }

    // config = {
    //     database: 'jogo_forca',
    //     host: this.host,
    //     user: 'postgres',
    //     password: 'postgres',
    //     port: 5432
    // }
    constructor() {
        this.connData = this.config;
    }

    fetchRow = async (text, value = undefined) => {
        try {
            const client = new Client(this.connData);
            await client.connect();
            const res = await client.query(text, value);
            await client.end();

            if (Array.isArray(res)) return res[res.length - 2].rows;
            return res.rows;
        } catch (error) {
            throw new Error(`Erro ao executar consulta: ${error.message} - Dados de conexão: ${JSON.stringify(this.connData)}`);
        }
    };

    create = async (objData, table) => {
        try {
            const sqlCreate = this.objToSqlCreate(objData, table)

            const r = await this.fetchRow(sqlCreate)

            return r[0] || []
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async (table, innerTable = null, fkName1 = null, fkName2 = null, where = null) => {
        try {
            if (!innerTable) {
                var sql = `SELECT * FROM ${table} `
            } else {
                var sql = `SELECT * FROM ${table} 
                           INNER JOIN ${innerTable}
                             ON ${fkName1}=${fkName2} `
            }

            if (where) {
                let cond = []
                where.map(v => {
                    cond.push(` ${v.column} = ${v.value} `)
                })

                sql = ` ${sql} 
                        WHERE ${cond.join(' AND ')} `
            }

            sql = `${sql} 
                    ORDER BY 1 DESC`

            // console.log(sql)

            const users = await this.fetchRow(sql)

            return users
        } catch (error) {
            console.log(error)
        }
    }

    removeUser = async id => {
        const sql = `DELETE FROM usuarios WHERE pk_cod_usuario = ${id}`

        if (await this.fetchRow(sql)) return true
    }

    removeCategory = async id => {
        const sql = `DELETE FROM categorias WHERE pk_cod_categoria = ${id}`

        if (await this.fetchRow(sql)) return true
    }

    removeWord = async id => {
        const sql = `DELETE FROM palavras WHERE pk_cod_palavra = ${id}`

        if (await this.fetchRow(sql)) return true
    }

    updateUser = async data => {
        const sql = `UPDATE usuarios
                     SET nome_usuario = '${data.nome_usuario}',
                         usuario = '${data.usuario}',
                         senha = '${data.senha}'
                     WHERE pk_cod_usuario = ${data.pk_cod_usuario}
                     RETURNING *
                     `;

        const user = await this.fetchRow(sql)

        return user
    }

    updateCategory = async data => {
        const sql = `UPDATE categorias
                     SET nome_categoria = '${data.nome_categoria}'
                     WHERE pk_cod_categoria = ${data.pk_cod_categoria}
                     RETURNING *
                     `;

        const category = await this.fetchRow(sql)

        return category
    }
    updateWord = async data => {
        const sql = `UPDATE palavras
                     SET nome_palavra = '${data.nome_palavra}',
                        dificuldade = ${data.dificuldade},
                        fk_cod_categoria = ${data.fk_cod_categoria}
                     WHERE pk_cod_palavra = ${data.pk_cod_palavra}
                     RETURNING *
                     `;

        const word = await this.fetchRow(sql)

        return word
    }

    objToSqlCreate(obj, table) {
        let fields = []
        let values = []

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                fields.push(`${key}`)
                values.push(withQuotes(obj[key]))
            }
        }

        const sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${values.join(',')}) returning *`

        return sql
    }

}

module.exports = BaseRepository;
