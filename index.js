import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

const days = ["2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08"];
const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

const run = async () => {
  for (const day of days) {
    const n = rand(8, 18);
    console.log(`>> ${day} -> ${n} commits`);

    const secs = Array.from({ length: n }, () => rand(21600, 75600)).sort((a, b) => a - b);

    for (const s of secs) {
      const date = moment(`${day}T00:00:00+05:30`).add(s, "seconds").format();
      await jsonfile.writeFile(path, { date });
      process.env.GIT_AUTHOR_DATE = date;
      process.env.GIT_COMMITTER_DATE = date;
      await git.add([path]).commit(date, { "--date": date });
    }
  }
  await git.push();
};

run();
