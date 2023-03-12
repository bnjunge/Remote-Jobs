const axios = require("axios");

class Main {
  async getJobs() {
    const jobs = await axios.get("https://remoteok.com/api");
    const job = await jobs.data;
    return job;
  }
}

module.exports = Main;

