const sql = require('mssql');
const { checkRateLimit } = require('./githubRateLimit');

const testDbConnection = async () => {
  try {
    const token = process.env.GITHUB_TOKEN; // Supondo que você tenha o token armazenado em uma variável de ambiente
    const { remainingRequests, timeUntilReset } = await checkRateLimit(token);

    console.log(`Numero de consultas disponíveis na API do GIT: ${remainingRequests}`);
    console.log(`Limite de requisições resetará em: ${timeUntilReset} minutes`);

    const transaction = new sql.Transaction();
    await transaction.begin();

    const queryTestUpdate = `
      CREATE TABLE #TestPermissions (TestColumn INT);
      INSERT INTO #TestPermissions (TestColumn) VALUES (1);
      UPDATE #TestPermissions SET TestColumn = 2 WHERE TestColumn = 1;
      DELETE FROM #TestPermissions WHERE TestColumn = 2;
      DROP TABLE #TestPermissions;
    `;

    const requestTestUpdate = new sql.Request(transaction);
    await requestTestUpdate.query(queryTestUpdate);

    await transaction.commit();
    console.log('Usuráio do banco tem acessos a: UPDATE,DELETE E INSERT.');
  } catch (error) {
    console.error('Error testing database connection:', error.message);
  }
};

module.exports = { testDbConnection };
