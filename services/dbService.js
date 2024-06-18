const sql = require('mssql');
const { dbConfig } = require('../config');

const updateDatabase = async (results) => {
  const pool = await sql.connect(dbConfig);
  console.log('Connected to SQL Server successfully.');

  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  const formattedCurrentTime = currentDate.toTimeString().split(' ')[0];

  for (const result of results) {
    const { fonte, data, hora } = result;

    const querySelect = `
      SELECT TOP 1 * FROM RPO_GIT_DATA
      WHERE fonte_rpo = @fonte
      ORDER BY data_atualizacao_rpo DESC, hora_fonte_rpo DESC;
    `;

    const selectResult = await pool.request()
      .input('fonte', sql.VarChar(50), fonte)
      .query(querySelect);

    if (selectResult.recordset.length > 0) {
      const queryUpdate = `
        UPDATE RPO_GIT_DATA
        SET fonte_git = @fonteGit,
            data_fonte_git = @dataGit,
            hora_fonte_git = @horaGit,
            data_atualizacao_git = @dataAtualizacaoGit
        WHERE id = @id;
      `;

      await pool.request()
        .input('fonteGit', sql.VarChar(50), fonte)
        .input('dataGit', sql.VarChar, data)
        .input('horaGit', sql.VarChar, hora)
        .input('dataAtualizacaoGit', sql.VarChar, `${formattedCurrentDate} ${formattedCurrentTime}`)
        .input('id', sql.Int, selectResult.recordset[0].id)
        .query(queryUpdate);
    }
  }
};

module.exports = { updateDatabase };