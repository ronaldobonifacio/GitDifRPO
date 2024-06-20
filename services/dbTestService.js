const sql = require('mssql');
const { checkRateLimit } = require('./githubRateLimit');

const testDbConnection = async () => {
  try {
    const token = process.env.GITHUB_TOKEN; // Supondo que você tenha o token armazenado em uma variável de ambiente
    const { remainingRequests, timeUntilReset } = await checkRateLimit(token);

    console.log(`Número de consultas disponíveis na API do GIT: ${remainingRequests}`);
    console.log(`Limite de requisições resetará em: ${timeUntilReset} minutos`);

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
