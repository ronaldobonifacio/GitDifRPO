const axios = require('axios');
const { separateDateAndTime, extractFileName } = require('../utils/dateUtils');

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

axios.defaults.timeout = 20000;

const getFilesAndCommits = async (branch, extension, filePath = null) => {
  const branchResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (!branchResponse.data) {
    throw new Error('Branch not found');
  }

  const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  let files = treeResponse.data.tree.filter(item => item.type === 'blob' && item.path.endsWith(`.${extension}`));

  if (filePath) {
    files = files.filter(item => item.path === filePath);
  }

  if (files.length === 0) {
    throw new Error('No files found with the specified extension or path');
  }

  const results = [];
  for (const file of files) {
    const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      params: {
        path: file.path,
        sha: branch,
        per_page: 1
      }
    });

    const lastCommitDate = commitsResponse.data.length > 0 ? commitsResponse.data[0].commit.author.date : 'No commit found';
    const { date, time } = separateDateAndTime(lastCommitDate);
    const fileName = extractFileName(file.path);
    results.push({
      fonte: fileName.toUpperCase(),
      data: date,
      hora: time
    });
  }

  return results;
};

module.exports = { getFilesAndCommits };