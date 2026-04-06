import fs from "fs";
import path from "path";
import { hashHistoryPath, hashIndexPath, supportedPath, unsupportedPath } from "./paths.js";
import { buildCache, cleanCache, cleanHashIndex } from "./cache.js";
import { buildAllHashDatabases, globalHashMap } from "./api.js";
import { handleDuplicates } from "./handleDuplicates.js";
import { detectConsole } from "./detectSystems.js";
import { scanSource } from "./scanSource.js";
import { isRomFile } from "./filterRoms.js";
import { raHashInput } from "./hasher.js";

export async function runScanner(romFolder: string, apiKey?: string) {
    if (apiKey) await buildAllHashDatabases(apiKey);

    const { supportedGames, unsupportedGames, hashIndex, hashHistory } = buildCache();
    
    cleanCache(supportedGames, romFolder);
    cleanCache(unsupportedGames, romFolder);
    cleanHashIndex(hashIndex, romFolder);

    const files = [];

    for await (const file of scanSource(romFolder)) {
        if (isRomFile(file.path)) files.push(file);
    }

    let i = 0;
    let errors = 0;
    const total = files.length;

    for await (const file of files) {
        if (!isRomFile(file.path)) continue;

        i++;

        const progress = `[${i}/${total}]`;
        
        const name = path.basename(file.path);
        const size = file.size ?? 0;

        const parts = file.path.split("/");
        const folder = parts.length > 1 ? parts[0]!.toUpperCase() : path.basename(file.source).toUpperCase();;

        const consoleId = detectConsole(file.path ?? file.internalPath ?? file.source);

        if (!consoleId) {
            errors++;
            console.log(`${progress} ❌ Unknown console: ${file.path}`);
            continue;
        }

        const historyKey = `${name}:${size}:${file.source}`;
        const cached = hashHistory.get(historyKey);
        let hash = supportedGames.get(file.path) ?? unsupportedGames.get(file.path) ?? null;
        if (!hash && cached && cached.size === size) hash = cached.hash;
        if (hash && !globalHashMap.has(hash)) hash = null;

        if (!hash) {
            try {
                process.stdout.write(`${progress} 🔄 ${folder.padEnd(8)} ${name} -> Hashing...`);
                const input = file.realPath ?? file.getStream?.();
                if (!input) throw new Error("No input source available");
                hash = await raHashInput(consoleId, input, name);
            } catch (err) {
                if (err instanceof Error) {
                    errors++;
                    process.stdout.clearLine(0);
                    process.stdout.cursorTo(0);
                    console.log(`${progress} ❌ ${folder.padEnd(8)} ${name} -> ${err.message}`);
                }
            }
        }

        if (!hash) continue;

        const game = globalHashMap.get(hash);

        if (!hashIndex.has(hash)) hashIndex.set(hash, []);
        const list = hashIndex.get(hash)!;
        const set = new Set(list);
        set.add(file.path);
        hashIndex.set(hash, [...set]);

        if (game) supportedGames.set(file.path, hash);
        else unsupportedGames.set(file.path, hash);
        hashHistory.set(historyKey, { hash, size });

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(`${progress} ${game ? "✅" : "❌"} ${folder.padEnd(8)} ${name} -> ${game?.Title ?? "Not supported"} ${game ? `[${game.NumAchievements} Achievements]` : ""}`);
    }

    console.log("\nScan complete")
    console.log(`\nSupported games: ${supportedGames.size}`);
    console.log(`Unsupported games: ${unsupportedGames.size}`);
    if (errors > 0) console.log(`Errors: ${errors}`);
        
    handleDuplicates(hashIndex, supportedGames, unsupportedGames, globalHashMap);

    fs.writeFileSync(supportedPath, JSON.stringify(Object.fromEntries(supportedGames), null, 2));
    fs.writeFileSync(unsupportedPath, JSON.stringify(Object.fromEntries(unsupportedGames), null, 2));
    fs.writeFileSync(hashIndexPath, JSON.stringify(Object.fromEntries(hashIndex), null, 2));
    fs.writeFileSync(hashHistoryPath, JSON.stringify(Object.fromEntries(hashHistory), null, 2));
    fs.writeFileSync("supported_games.txt", Array.from(supportedGames.keys()).join("\n"));
    fs.writeFileSync("unsupported_games.txt", Array.from(unsupportedGames.keys()).join("\n"));
}
