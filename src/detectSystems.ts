import path from "path";
import { getRelative } from "./paths.js";
import { systems } from "./systemsMap.js";

function normalise(str: string) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normaliseExt(ext: string) {
    return ext.startsWith(".") ? ext.toLowerCase() : "." + ext.toLowerCase();
}

const extensionLookup = new Map<string, number[]>();
const folderLookup = new Map<string, number>();

for (const system of systems) {
    for (const name of system.names) {
        folderLookup.set(normalise(name), system.id);
    }

    for (const ext of system.extensions) {
        const e = normaliseExt(ext);

        if (!extensionLookup.has(e)) {
            extensionLookup.set(e, []);
        }

        extensionLookup.get(e)!.push(system.id);
    }
}

const folderAliasesSorted = [...folderLookup.entries()].sort(
    ([a], [b]) => b.length - a.length,
);

export function detectSystemFromFolder(folder: string) {
    const name = normalise(folder);

    for (const [alias, id] of folderAliasesSorted) {
        if (name.includes(alias)) return id;
    }

    return null;
}

export function detectSystemFromExtension(ext: string) {
    return extensionLookup.get(normaliseExt(ext)) ?? [];
}

export function detectConsole(romFolder: string, file: string): number | null {
    const relative = getRelative(romFolder, file);
    const parts = relative.split("/");

    for (const part of parts) {
        const system = detectSystemFromFolder(part);
        if (system) return system;
    }

    const system = detectSystemFromFolder(path.basename(romFolder));
    if (system) return system;

    const ext = path.extname(file).toLowerCase();
    const possible = detectSystemFromExtension(ext);

    if (possible.length === 1) return possible[0] as number | null;

    return null;
}
