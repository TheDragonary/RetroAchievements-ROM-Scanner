import fs from "fs";
import path from "path";
import { API_DIR, consolesPath } from "./paths.js";
import type { Console, Game } from "./types.js";

export const globalHashMap = new Map<string, Game>();

export async function getConsoleList(apiKey: string): Promise<Console[]> {
    return fetch(`https://retroachievements.org/API/API_GetConsoleIDs.php?y=${apiKey}&g=1`).then((r) => r.json());
}

export async function fetchGamesForConsole(
    consoleId: number,
    apiKey: string,
    retries = 3,
    delayMs = 1000,
): Promise<Game[]> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(`https://retroachievements.org/API/API_GetGameList.php?y=${apiKey}&i=${consoleId}&h=1`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const games: Game[] = await res.json();
            if (!Array.isArray(games)) throw new Error("Invalid response format");
            return games;
        } catch (err) {
            process.stdout.write(`Failed to fetch console ${consoleId} (attempt ${attempt}): ${(err as Error).message}`);
            if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs));
        }
    }
    return [];
}

export async function buildAllHashDatabases(apiKey: string) {
    let consoles: Console[];
    if (!fs.existsSync(consolesPath)) {
        consoles = await getConsoleList(apiKey);
        fs.writeFileSync(consolesPath, JSON.stringify(consoles, null, 2));
    } else {
        consoles = JSON.parse(fs.readFileSync(consolesPath, "utf8"));
    }

    for (const c of consoles) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`Loading ${c.Name}...`);

        let games: Game[];
        if (!fs.existsSync(path.join(API_DIR, `${c.ID}.json`))) {
            games = await fetchGamesForConsole(c.ID, apiKey);
            fs.writeFileSync(
                path.join(API_DIR, `${c.ID}.json`),
                JSON.stringify(games, null, 2),
            );
        } else {
            games = JSON.parse(
                fs.readFileSync(path.join(API_DIR, `${c.ID}.json`), "utf8"),
            );
        }

        for (const game of games) {
            for (const hash of game.Hashes ?? []) {
                globalHashMap.set(hash.toLowerCase(), game);
            }
        }
    }

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(`Loaded ${globalHashMap.size} hashes`);
}
