const axios = require('axios');
const { separateDateAndTime, extractFileName } = require('../utils/dateUtils');

const getFilesAndCommits = async (branch, extension, filePath) => {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  axios.defaults.timeout = 20000;

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers });
    let files = treeResponse.data.tree.filter(item => item.type === 'blob');

    if (filePath) {
      files = files.filter(item => item.path === filePath);
    } else if (extension) {
      files = files.filter(item => item.path.endsWith(`.${extension}`));
    }

    if (files.length === 0) {
      throw new Error('No files found with the specified extension or file path');
    }

    const filesAndCommits = [];

    for (const file of files) {
      const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
        headers,
        params: {
          path: file.path,
          sha: branch,
          per_page: 1
        }
      });

      const lastCommitDate = commitsResponse.data.length > 0 ? commitsResponse.data[0].commit.author.date : 'No commit found';
      const { date, time } = separateDateAndTime(lastCommitDate);
      const fileName = extractFileName(file.path);

      filesAndCommits.push({
        fonte: fileName.toUpperCase(),
        data: date,
        hora: time
      });
    }

    return filesAndCommits;
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error.message);
    throw error;
  }
};

module.exports = { getFilesAndCommits };