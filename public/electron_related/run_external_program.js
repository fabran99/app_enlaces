var fs = require("fs");
var exec = require("child_process").exec;
const MIPONY_ROUTES = [
  "C:\\Program Files\\MiPony\\Mipony.exe",
  "C:\\Program Files (x86)\\MiPony\\Mipony.exe",
];

const runApp = (route) => {
  //   execute the .exe in the route without blocking thread
  exec(`"${route}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
};

const runMiPony = (posibleRoutes = MIPONY_ROUTES) => {
  for (let i = 0; i < posibleRoutes.length; i++) {
    // check if file exists, then run it and return
    if (fs.existsSync(posibleRoutes[i])) {
      runApp(posibleRoutes[i]);
      return;
    }
  }
};

module.exports = { runMiPony };
