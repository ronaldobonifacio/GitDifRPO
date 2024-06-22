const express = require('express');
const { getFilesAndCommits } = require('../services/githubService');
const { insertCommitData } = require('../services/dbService');

const router = express.Router();

router.get('/:branch/:extension/:filePath?', async (req, res) => {
  const { branch, extension, filePath } = req.params;
  const normalizedExtension = extension.toLowerCase(); // Normaliza a extensão

  try {
    const filesAndCommits = await getFilesAndCommits(branch, normalizedExtension, filePath);
    
    for (const commitData of filesAndCommits) {
      await insertCommitData(commitData, branch);
    }

    res.json({ message: 'Dados inseridos com sucesso no bando de dados', data: filesAndCommits });
  } catch (error) {
    console.error('Erro ao processar requisição:', error.message);
    res.status(500).json({ error: 'Erro ao processar requisição' });
  }
});

module.exports = router;