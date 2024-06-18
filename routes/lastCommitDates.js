const express = require('express');
const { getFilesAndCommits } = require('../services/githubService');
const { updateDatabase } = require('../services/dbService');

const router = express.Router();

router.get('/:branch/:extension/:filePath?', async (req, res) => {
  const { branch, extension, filePath } = req.params;

  try {
    const results = await getFilesAndCommits(branch, extension, filePath);
    await updateDatabase(results);
    res.json({ message: 'Data successfully updated in the database', data: results });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to get commit dates' });
  }
});

module.exports = router;