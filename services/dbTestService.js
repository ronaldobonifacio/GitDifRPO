const sql = require('mssql');

const testDbConnection = async () => {
  try {
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
    console.log('User has UPDATE, DELETE, and INSERT permissions.');
  } catch (permError) {
    console.error('User does not have the necessary permissions:', permError.message);
  }
};

module.exports = { testDbConnection };