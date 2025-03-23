const BASE_SEARCH_URL = 'https://api.github.com/search/repositories';

// Load GitHub token if available (from .env file)
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
if (!GITHUB_TOKEN) {
  console.warn('No GitHub token provided! Check your .env file.');
} else {
  console.log('GitHub Token Loaded:', GITHUB_TOKEN.substring(0, 4) + '...');
}

const buildHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }
  return headers;
};

// Accepts createdAfter as a parameter.
export const fetchRepos = async (createdAfter, page = 1) => {
  const url = `${BASE_SEARCH_URL}?q=created:>${createdAfter}&sort=stars&order=desc&page=${page}`;
  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    throw new Error(`Error fetching repos: ${response.status}`);
  }
  const data = await response.json();
  return data.items;
};

// The other endpoints remain unchanged.
export const fetchCodeFrequency = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`;
  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    throw new Error(`Error fetching code frequency: ${response.status}`);
  }
  return await response.json();
};

export const fetchCommitActivity = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`;
  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    throw new Error(`Error fetching commit activity: ${response.status}`);
  }
  return await response.json();
};

export const fetchContributorsStats = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/contributors`;
  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    throw new Error(`Error fetching contributors stats: ${response.status}`);
  }
  return await response.json();
};
