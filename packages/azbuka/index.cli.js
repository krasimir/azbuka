#!/usr/bin/env node

import fs from 'fs';
import path from "node:path";
import { pathToFileURL } from "node:url";
import { program } from "commander";
import chokidar from "chokidar";

import Azbuka from './index.js';

const POSSIBLE_CONFIG_FILES = [
  process.cwd() + "/azbuka.config.json",
  process.cwd() + "/azbuka.config.js",
  process.cwd() + "/azbuka.config.mjs"
];

program.option("-c, --config <string>,", "Path to azbuka config file", POSSIBLE_CONFIG_FILES[0]);
program.option("-w, --watch", "Enable watch mode", false);
program.option("-v, --verbose", "Enable watch mode", false);
program.parse();

const options = program.opts();
let config = null, instance = null;

if (!fs.existsSync(options.config)) {
  let found = false;
  for (let possibleConfigFile of POSSIBLE_CONFIG_FILES) {
    if (fs.existsSync(possibleConfigFile)) {
      options.config = possibleConfigFile;
      found = true;
      break;
    }
  }
  if (!found) {
    throw new Error(`azbuka: config file not found at ${options.config} or any of the default locations.`);
  }
}

async function loadConfig(configPath) {
  const abs = path.resolve(configPath);
  if (abs.toLowerCase().endsWith('.json')) {
    const jsonStr = fs.readFileSync(abs, "utf-8");
    if (options.verbose) {
      console.log(`azbuka: Loaded config file from ${abs.replace(process.cwd(), '')}`);
    }
    try {
      return JSON.parse(jsonStr);
    } catch(err) {
      throw new Error(`azbuka: error parsing config file at ${configPath}: ${err}`);
    }
  } else {
    const module = await import(pathToFileURL(abs).href);
    if (options.verbose) {
      console.log(`azbuka: Loaded config file from ${abs.replace(process.cwd(), '')}`);
    }
    return module.default || module;
  }
}
async function runAzbuka(lookAtPath = null) {
  if (!config) {
    // The very first run
    config = await loadConfig(options.config);
    if (!config.dir) {
      throw new Error('azbuka: missing "dir" in configuration.');
    }
    if (!config.output) {
      throw new Error('azbuka: missing "output" in configuration.');
    }
    instance = Azbuka(config);
    if (options.watch) {
      const watcher = chokidar.watch(config.dir, {
        persistent: true,
        ignoreInitial: true,
        ignored: (p, stats) => path.resolve(p) === path.resolve(config.output)
      });
      watcher.on("change", async (filePath) => {
        if (options.verbose) {
          console.log(`azbuka: Detected change in ${filePath}`);
        }
        runAzbuka(filePath);
      });
      if (options.verbose) {
        console.log("azbuka: Watch mode enabled. Listening for file changes...");
      }
    }
  }
  if (lookAtPath) {
    instance.parseFile({ file: lookAtPath, output: config.output });
  } else {
    instance.parseDirectory({ dir: config.dir, output: config.output });
  }
}

runAzbuka();

