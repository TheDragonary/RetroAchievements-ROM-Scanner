import path from "path";
import { systems } from "./systemsMap.js";

const ignoreSet = new Set([".directory", "thumbs.db", ".ds_store"]);

const allowedExtensions = new Set(systems.flatMap((s) => s.extensions));

export function isRomFile(filePath: string): boolean {
    const name = path.basename(filePath).toLowerCase();

    if (ignoreSet.has(name)) return false;

    const ext = path.extname(name);
    return allowedExtensions.has(ext);
}
