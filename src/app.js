require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const { dbConfig } = require('./config');
const { testDbConnection } = require('./services/dbTestService');
const lastCommitDatesRoute = require('./routes/lastCommitDates');
const { checkRateLimit } = require('./services/gitHubRateLimit')
const app = express();
const port = process.env.PORT || 9000;
const token = process.env.GITHUB_TOKEN;

// Teste de conexão com o banco de dados ao iniciar o servidor
sql.connect(dbConfig)
  .then(async () => {
    console.log('Conexão com banco de dados realizada com sucesso!');
    await testDbConnection();
    await checkRateLimit(token)
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}/last-commit-dates/dev/txt`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar com banco de dados:', err.message);
  });

app.use('/last-commit-dates', lastCommitDatesRoute);

module.exports = app;