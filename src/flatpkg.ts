#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import fse from "fs-extra";
import semver from "semver";
import tree from "tree-cli";
import { Command } from "commander";

const program = new Command();
program
  .name("flatpkg")
  .description(
    "Publish flat NPM packages regardless of your directory structure."
  )
  .usage("[dir...]")
  .version(require("../package.json").version)
  .argument("[dirs...]")
  .option("-b, --bump <major, minor, patch, premajor, preminor>")
  .action(async (args, opts) => {
    console.log({ args, opts });

    const distDir = process.cwd() + "/.pkg";

    if (args.length == 0) {
      program.outputHelp();
      process.exit(1);
    }

    const files = ["**"];
    const pkg = require(process.cwd() + "/package.json");
    let version = pkg.version;
    if (opts.bump) {
      version = semver.inc(version, opts.bump);
    }
    semver.inc(version, "patch"); // 1.2.4
    fs.mkdirSync(distDir, { recursive: true });

    fs.writeFileSync(
      distDir + "/package.json",
      JSON.stringify(
        {
          ...pkg,

          version,
          files, // Overwrite with relative files for .pkg dir
        },
        null,
        2
      )
    );

    args.forEach((dir: string) => {
      recursiveCopy(dir, distDir);
    });

    console.log();
    console.log(
      "Publishing",
      [pkg.name, "@" + version].join(""),
      "to npmjs..."
    );
    console.log();

    await tree({
      base: distDir,
      fullpath: false,
    }).then((res) => {
      console.log(res.report);
    });

    execSync("npm publish", { stdio: "inherit", cwd: distDir });
    fs.rmSync(distDir, { recursive: true });
  });

program.parse();

function recursiveCopy(srcDir: string, destDir: string) {
  try {
    fse.copySync(srcDir, destDir, { overwrite: true });
  } catch (err) {
    console.error(err);
  }
}
