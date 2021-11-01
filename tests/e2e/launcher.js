require("dotenv").config();
const { spawn } = require("child_process");

const yarn = /^win/.test(process.platform) ? "yarn.cmd" : "yarn";

// Electron is bundled with Cypress, so use that.
const args = ["synpress", "run", "--browser", "electron"].concat(process.argv.slice(2));
// const app = spawn("yarn", args);
const app = spawn(yarn, args);

app.stdout.on("data", data => {
  console.log(`${data}`);
});

app.stderr.on("data", data => {
  console.error(`${data}`);
});

app.on("close", code => {
  console.log(`child process exited with code ${code}`);
});
