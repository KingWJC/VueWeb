// script to manually run eslint with `--fix` param to fix all staged files,
// in such way it lets us choose a flexible time to fix the files other than
// fix them at `git commit` stage.
import chalk from "chalk";
import sgf from "staged-git-files";
import { exec as execCmd } from "child_process";

// A: added
// C: copied
// M: modified
// get list of all staged files
sgf("ACM", (sgfErr, res) => {
  if (sgfErr) {
    console.error(`err in processing staged files: ${sgfErr}`);

    return;
  }

  // path/to/a.js path/to/b.vue
  let files = res
    .map((item) => {
      return item.filename;
    })
    .filter((item) => {
      return /\.(js|vue)$/.test(item);
    })
    .join(" ");

  // start `fix` process
  execCmd(`eslint --ext .js,.vue --fix ${files}`, (execErr, stdout) => {
    if (execErr) {
      console.error(
        chalk.red("Failed to fix files, eslint reports:\n"),
        stdout
      );
    } else {
      console.log(
        "All problematic files have been fixed!\n",
        "Please run",
        chalk.green("SourceTree"),
        "or",
        chalk.green("BeyondCompare"),
        "to double-check the fixed files."
      );
    }
  });
});
