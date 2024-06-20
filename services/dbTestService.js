const sql = require('mssql');

const testDbConnection = async () => {
  try {
    const transaction = new sql.Transaction();
    await transaction.begin();

    const queryTestUpdate = `
      CREATE TABLE #TestedePermissao (TestColumn INT);
      INSERT INTO #TestedePermissao (TestColumn) VALUES (1);
      UPDATE #TestedePermissao SET TestColumn = 2 WHERE TestColumn = 1;
      DELETE FROM #TestedePermissao WHERE TestColumn = 2;
      DROP TABLE #TestedePermissao;
    `;

    const requestTestUpdate = new sql.Request(transaction);
    await requestTestUpdate.query(queryTestUpdate);

    await transaction.commit();
    console.log('Usuário do banco tem acessos a: UPDATE,DELETE E INSERT.');
  } catch (error) {
    console.error('Erro de conexão com banco de dados:', error.message);
  }
};

module.exports = { testDbConnection };
