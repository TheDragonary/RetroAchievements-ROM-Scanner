import fs from "fs";
import path from "path";
import { hashHistoryPath, hashIndexPath, supportedPath, unsupportedPath } from "./paths.js";

export function buildCache() {
    let supportedGames = new Map<string, string>();
    let unsupportedGames = new Map<string, string>();
    let hashIndex = new Map<string, string[]>();
    let hashHistory = new Map<string, { hash: string; size: number }>();

    if (fs.existsSync(supportedPath)) supportedGames = new Map(Object.entries(JSON.parse(fs.readFileSync(supportedPath, "utf8"))));
    if (fs.existsSync(unsupportedPath)) unsupportedGames = new Map(Object.entries(JSON.parse(fs.readFileSync(unsupportedPath, "utf8"))));
    if (fs.existsSync(hashIndexPath)) hashIndex = new Map(Object.entries(JSON.parse(fs.readFileSync(hashIndexPath, "utf8"))) as [string, string[]][]);
    if (fs.existsSync(hashHistoryPath)) hashHistory = new Map(Object.entries(JSON.parse(fs.readFileSync(hashHistoryPath, "utf8"))));

    return {
        supportedGames,
        unsupportedGames,
        hashIndex,
        hashHistory,
    };
}

export function cleanCache(cache: Map<string, string>, romFolder: string) {
    for (const [relative] of cache) {
        const fullPath = path.join(romFolder, relative);
        if (!fs.existsSync(fullPath)) cache.delete(relative);
    }
}

export function cleanHashIndex(index: Map<string, string[]>, romFolder: string) {
    for (const [hash, paths] of index) {
        const valid = paths.filter((p) =>
            fs.existsSync(path.join(romFolder, p)),
        );

        if (valid.length === 0) {
            index.delete(hash);
        } else {
            index.set(hash, valid);
        }
    }
}
