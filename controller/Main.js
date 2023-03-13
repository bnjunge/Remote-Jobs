const axios = require("axios");
axios.defaults.headers.common["content-type"] = "application/json";
axios.defaults.headers.common["accept"] = "json";
axios.defaults.headers.common["user-agent"] = "user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50";

class Main {
  async getJobs() {
    const jobs = await axios.get("https://remoteok.com/api?api=1");

    if (jobs.status == 200 || jobs.status == "OK") {
      const job = await jobs.data;
      const arrayConstructor = [].constructor;

      if (job.constructor == arrayConstructor) {
        console.log("is array");
        return job;
      } else {
        console.log("is not array");
        return [];
      }
    } else {
      return [];
    }
  }
}

module.exports = Main;
