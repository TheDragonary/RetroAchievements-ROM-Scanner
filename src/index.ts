import fs from "fs";
import path from "path";
import { getRelative, hashHistoryPath, hashIndexPath, supportedPath, unsupportedPath } from "./paths.js";
import { detectConsole, detectSystemFromFolder } from "./detectSystems.js";
import { buildCache, cleanCache, cleanHashIndex } from "./cache.js";
import { buildAllHashDatabases, globalHashMap } from "./api.js";
import { handleDuplicates } from "./handleDuplicates.js";
import { raHash, hashRvz } from "./hasher.js";
import { scanRomFolder } from "./scanner.js";

export async function runScanner(romFolder: string, apiKey?: string) {
    if (apiKey) await buildAllHashDatabases(apiKey);
    const romFiles = scanRomFolder(romFolder);

    const { supportedGames, unsupportedGames, hashIndex, hashHistory } = buildCache();
    
    cleanCache(supportedGames, romFolder);
    cleanCache(unsupportedGames, romFolder);
    cleanHashIndex(hashIndex, romFolder);

    const rootSystem = detectSystemFromFolder(path.basename(romFolder));

    for (let i = 0; i < romFiles.length; i++) {
        const file = romFiles[i];
        if (!file) continue;
        const relative = getRelative(romFolder, file);
        const parts = relative.split("/");
        const folder = parts.length > 1 ? parts[0]!.toUpperCase() : rootSystem ? path.basename(romFolder).toUpperCase() : "";
        const ext = path.extname(file).toLowerCase();
        const name = path.basename(file);
        const stat = fs.statSync(file);
        const size = stat.size;

        const progress = `[${i + 1}/${romFiles.length}]`;

        const consoleId = detectConsole(romFolder, file);

        if (!consoleId) {
            console.log(`${progress} ❌ Unknown console: ${file}`);
            continue;
        }

        const historyKey = `${name}:${size}`;
        const cached = hashHistory.get(historyKey);
        let hash = supportedGames.get(relative) ?? unsupportedGames.get(relative) ?? null;
        if (!hash && cached && cached.size === size) hash = cached.hash;
        if (hash && !globalHashMap.has(hash)) hash = null;

        if (!hash) {
            try {
                process.stdout.write(`${progress} 🔄 ${folder.padEnd(8)} ${name} -> Hashing...`);
                if (ext === ".rvz") {
                    hash = await hashRvz(file);
                } else {
                    hash = await raHash(consoleId, file);
                }
            } catch (err) {
                if (err instanceof Error) {
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
        set.add(relative);
        hashIndex.set(hash, [...set]);

        if (game) supportedGames.set(relative, hash);
        else unsupportedGames.set(relative, hash);

        hashHistory.set(historyKey, { hash, size });

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(`${progress} ${game ? "✅" : "❌"} ${folder.padEnd(8)} ${name} -> ${game?.Title ?? "Not supported"} ${game ? `[${game.NumAchievements} Achievements]` : ""}`);
    }

    console.log("\nScan complete")
    console.log(`\nSupported games: ${supportedGames.size}`);
    console.log(`Unsupported games: ${unsupportedGames.size}`);
        
    handleDuplicates(hashIndex, supportedGames, unsupportedGames, globalHashMap);

    fs.writeFileSync(supportedPath, JSON.stringify(Object.fromEntries(supportedGames), null, 2));
    fs.writeFileSync(unsupportedPath, JSON.stringify(Object.fromEntries(unsupportedGames), null, 2));
    fs.writeFileSync(hashIndexPath, JSON.stringify(Object.fromEntries(hashIndex), null, 2));
    fs.writeFileSync(hashHistoryPath, JSON.stringify(Object.fromEntries(hashHistory), null, 2));

    fs.writeFileSync("supported_games.txt", Array.from(supportedGames.keys()).join("\n"));
    fs.writeFileSync("unsupported_games.txt", Array.from(unsupportedGames.keys()).join("\n"));
}
