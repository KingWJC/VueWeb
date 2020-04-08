// use babel-plugin-external-helpers to compile an individual module
// for babelHelpers
import { exec as execCmd } from "child_process";

// virtual original babel helpers module, used as a placeholder
export default function() {
  const callback = this.async();

  // call babel-external-helpers to generate babelHelpers lib
  execCmd("babel-external-helpers", (error, stdout) => {
    if (error) {
      callback(`exec error: ${error}`);
    } else {
      callback(null, `module.exports=${JSON.stringify(stdout)};`);
    }
  });
}
