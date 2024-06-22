const sql = require('mssql');
const { dbConfig } = require('../config');
const table = process.env.DB_TABLE

const insertCommitData = async (commitData, branch) => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Conexão com banco de dados realizada com sucesso!');

    const { fonte, data, hora } = commitData;

    const queryInsert = `
      INSERT INTO ${table} (ambiente_git, fonte_git, data_fonte_git, hora_fonte_git, data_atualizacao_git)
      VALUES (@branch, @fonte, @data, @hora, GETDATE());
    `;

    await pool.request()
      .input('branch', sql.VarChar(50), branch)
      .input('fonte', sql.VarChar(50), fonte)
      .input('data', sql.VarChar, data)
      .input('hora', sql.VarChar, hora)
      .query(queryInsert);

    console.log('Dados inseridos com sucesso na tabela:',process.env.DB_TABLE);
  } catch (error) {
    console.error('Erro ao inserir dados na tabela:', error.message);
    throw error;
  }
};

module.exports = { insertCommitData };