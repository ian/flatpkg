#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const fse = require("fs-extra");

async function run() {
  if (process.argv.length < 3) {
    console.log("Usage: shippy dir [...dir]");
    return;
  }
  fs.mkdirSync("./.pkg", { recursive: true });
  // fs.copyFileSync("./package.json", "./.pkg/package.json");

  process.argv.slice(2).forEach((dir) => {
    recursiveCopy(dir, "./.pkg");
  });

  execSync("npm publish", { stdio: "inherit", cwd: "./.pkg" });
  // fs.rmSync("./.pkg", { recursive: true });
}

function recursiveCopy(srcDir, destDir) {
  try {
    fse.copySync(srcDir, destDir, { overwrite: true | false });
  } catch (err) {
    console.error(err);
  }
}

run();
