import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

// Make one commit on a random day within the past year.
const makeCommit = async () => {
  const weeks = Math.floor(Math.random() * 55); // 0–54 weeks back
  const day = Math.floor(Math.random() * 7); // 0–6 days into that week
  const date = moment()
    .subtract(1, "year")
    .add(1, "day")
    .add(weeks, "weeks")
    .add(day, "days")
    .format();

  await jsonfile.writeFile(path, { date });
  process.env.GIT_AUTHOR_DATE = date;
  process.env.GIT_COMMITTER_DATE = date;
  await git.add([path]).commit(date, { "--date": date });
};

// Pass how many commits you want; dates are randomised across the past year.
const run = async (n) => {
  for (let i = 0; i < n; i++) {
    await makeCommit();
    console.log(`>> commit ${i + 1}/${n}`);
  }
  await git.push();
};

const count = Number(process.argv[2]) || 100;
run(count);
