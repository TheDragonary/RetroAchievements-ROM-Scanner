#!/usr/bin/env node

import { Command } from "commander";
import "dolphin-tool";
import envPaths from "env-paths";
import fs from "fs";
import path from "path";
import { runScanner } from "./index.js";

const program = new Command();
const paths = envPaths("ra-scan");

const apiDir = path.join(paths.cache, "api");
const scanDir = path.join(paths.cache, "scan");
const historyDir = path.join(paths.cache, "history");

function createDirs() {
    fs.mkdirSync(apiDir, { recursive: true });
    fs.mkdirSync(scanDir, { recursive: true });
    fs.mkdirSync(historyDir, { recursive: true });
}

program
    .name("ra-scan")
    .description("Scan ROM folders for RetroAchievements compatibility")
    .version("0.1.6")
    .argument("<roms>", "ROM folder to scan")
    .option("-k, --api-key <key>", "RetroAchievements API key")
    .option("-C, --clear-cache", "clear API and scan cache before scanning")
    .option("-H, --clear-history", "clear stored ROM hash history")
    .action(async (roms, options) => {
        if (options.clearCache) {
            console.log("Clearing cache:", paths.cache);
            if (fs.existsSync(apiDir)) fs.rmSync(apiDir, { recursive: true, force: true });
            if (fs.existsSync(scanDir)) fs.rmSync(scanDir, { recursive: true, force: true });
        }

        if (options.clearHistory) {
            console.log("Clearing history:", historyDir);
            if (fs.existsSync(historyDir)) fs.rmSync(historyDir, { recursive: true, force: true });
        }

        createDirs();
        await runScanner(roms, options.apiKey);
    })
    .showHelpAfterError()
    .parseAsync();
