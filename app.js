const express = require("express");
const path = require("path");
const Main = require("./controller/Main");
const NodeCache = require("node-cache");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

const cache = new NodeCache({ stdTTL: 100, checkperiod: 3600 });

app
  .get("/", async (req, res) => {
    const cachedJobs = cache.get("jobs");
    if (cachedJobs) {
      console.log("Jobs are cached");
      cachedJobs.shift();
      const randomJobs = cachedJobs
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5);

      randomJobs.length = 6;
      return res.render("index", { jobs: randomJobs });
    } else {
      const main = new Main();
      const jobs = await main.getJobs();

      // console.log(jobs)

      if (jobs.length > 0) {
        cache.set("jobs", jobs, 7200);
        console.log("Jobs are not cached");
        jobs.shift();

        const randomJobs = jobs
          .sort(() => Math.random() - 0.5)
          .sort(() => Math.random() - 0.5);
        randomJobs.length = 6;
        return res.render("index", { jobs: randomJobs });
      } else {
        return res.render("index", { jobs: [] });
      }
    }
  })
  .get("/about", (req, res) => {
    const meta = {
      title: "About",
      description: "About page",
      keywords: "about, jobs, remote jobs, remote work, remote work jobs",
    };
    res.render("about");
  })
  .get("/jobs", async (req, res) => {
    const cachedJobs = cache.get("jobs");
    if (cachedJobs) {
      console.log("Jobs are cached");
      cachedJobs.shift();
      const randomJobs = cachedJobs
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5);

      // randomJobs.length = 6;
      return res.render("jobs", { jobs: randomJobs });
    } else {
      const main = new Main();
      const jobs = await main.getJobs();

      cache.set("jobs", jobs, 7200);
      console.log("Jobs are not cached");
      jobs.shift();

      const randomJobs = jobs
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5);
      // randomJobs.length = ;
      res.render("jobs", { jobs: randomJobs });
    }
  })
  .get("/jobs/:id", async (req, res) => {
    // check if the job is cached
    try {
      const cachedJobs = cache.get("jobs");
      if (cachedJobs) {
        console.log("Jobs are cached");
        const job = cachedJobs.find((job) => job.slug === req.params.id);
        job.description = job.description
          .replace(/Â/g, "")
          .replace(/â\x82¬/g, "€")
          .replace(/ â\x80¢ /g, " - ")
          .replace(/â\x80\x93/g, "-")
          .replace(/â\x80\x99/g, "'")
          .replace(/ð\x9F\x99\x82/g, "🙂")
          .replace(/â\x80\x94/g, " - ")
          .replace(/â\x80\x98/g, "'");

        cachedJobs.shift();
        cachedJobs
          .sort(() => Math.random() - 0.5)
          .sort(() => Math.random() - 0.5);
        cachedJobs.length = 5;

        return res.render("job", { job, jobs: cachedJobs });
      } else {
        const main = new Main();
        const jobs = await main.getJobs();

        cache.set("jobs", jobs, 7200);
        console.log("Jobs are not cached");
        const job = jobs.find((job) => job.slug === req.params.id);
        job.description = job.description
          .replace(/Â/g, "")
          .replace(/â\x82¬/g, "€")
          .replace(/ â\x80¢ /g, " - ")
          .replace(/â\x80\x93/g, "-")
          .replace(/â\x80\x99/g, "'")
          .replace(/ð\x9F\x99\x82/g, "🙂")
          .replace(/â\x80\x94/g, " - ")
          .replace(/â\x80\x98/g, "'");

        jobs.shift();
        jobs.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
        jobs.length = 5;
        res.render("job", { job, jobs });
      }
    } catch (err) {
      console.log(err);
      res.render("404");
    }
  })
  .get("/privacy", (req, res) => {
    res.render("privacy");
  })
  .get("/terms-and-conditions", (req, res) => {
    res.render("tos");
  })
  .get("/cookie-policy", (req, res) => {
    res.render("cookie-policy");
  })
  .all("*", (req, res) => {
    res.format({
      html: () => {
        res.status(404).render("404");
      },
      json: () => {
        res.status(404).json({ error: "Not found" });
      },
    });
  });

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is running on port 3000");
});
