const axios = require("axios");

const getGithubRepo = async (query, page, count) => {
  const { data } = await axios.get(
    `https://api.github.com/search/repositories?q=${query}&page=${page}&per_page=${count}`
  );
  return data;
};

module.exports = {
  getGithubRepo,
};
