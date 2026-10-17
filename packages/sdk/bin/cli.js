#!/usr/bin/env node
const { runCLI } = require("../dist/cli.js");
runCLI().catch((err) => {
  console.error(err);
  process.exit(1);
});
