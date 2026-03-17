import fs from "fs";
import path from "path";
import { systems } from "./systemsMap.js";

const ignoreSet: Set<string> = new Set([
    ".directory",
    "thumbs.db",
    ".ds_store",
]);

const allowedExtensions = new Set(systems.flatMap((s) => s.extensions));

export function scanRomFolder(dir: string): string[] {
    const files: string[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (ignoreSet.has(entry.name.toLowerCase())) continue;

        if (entry.isDirectory()) {
            files.push(...scanRomFolder(fullPath));
            continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (!allowedExtensions.has(ext)) continue;

        files.push(fullPath);
    }

    return files;
}
