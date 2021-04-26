const { Client } = require('pg');
const withQuotes = require('../_util/withQuotes');

class BaseRepository {

    config = {
        database: 'jogo_forca',
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        port: 5432
    }
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

    getUsers = async table => {
        const sql = `SELECT * FROM ${table} ORDER BY PK_COD_USUARIO DESC`

        const users = await this.fetchRow(sql)

        return users
    }

    removeUser = async id => {
        const sql = `DELETE FROM usuarios WHERE pk_cod_usuario = ${id}`

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
