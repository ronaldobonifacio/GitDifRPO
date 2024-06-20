require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const { dbConfig } = require('./config');
const { testDbConnection } = require('./services/dbTestService');
const lastCommitDatesRoute = require('./routes/lastCommitDates');

const app = express();
const port = process.env.PORT || 3000;

// Teste de conexão com o banco de dados ao iniciar o servidor
sql.connect(dbConfig)
  .then(async () => {
    console.log('Conexão com banco de dados realizada com sucesso!');
    await testDbConnection();
    app.listen(port, () => {
      console.log(`Servidor rodando emhttp://localhost:${port}/last-commit-dates/dev/txt`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to SQL Server:', err.message);
  });

app.use('/last-commit-dates', lastCommitDatesRoute);

module.exports = app;