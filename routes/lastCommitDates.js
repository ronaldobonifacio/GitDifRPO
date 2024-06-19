const express = require('express');
const { getFilesAndCommits } = require('../services/githubService');
const { insertCommitData } = require('../services/dbService');

const router = express.Router();

router.get('/:branch/:extension/:filePath?', async (req, res) => {
  const { branch, extension, filePath } = req.params;
  
  try {
    const filesAndCommits = await getFilesAndCommits(branch, extension, filePath);
    
    for (const commitData of filesAndCommits) {
      await insertCommitData(commitData, branch);
    }

    res.json({ message: 'Data successfully inserted into the database', data: filesAndCommits });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;