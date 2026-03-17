import { execFile } from "child_process";
import dolphinTool, { DigestAlgorithm } from "dolphin-tool";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { APP_DIR } from "./paths.js";

const execFileAsync = promisify(execFile);

const HASHER = path.join(
    APP_DIR,
    "bin",
    process.platform === "win32" ? "RAHasher.exe" : "RAHasher",
);

if (!fs.existsSync(HASHER)) {
    throw new Error(`RAHasher binary not found at ${HASHER}`);
}

function setupBinary() {
    if (process.platform === "win32") {
        const binDir = path.join(process.cwd(), "bin");
        process.env.PATH = `${binDir};${process.env.PATH}`;
    }
}

export async function raHash(consoleId: number, file: string): Promise<string> {
    const { stdout } = await execFileAsync(HASHER, [
        consoleId.toString(),
        file,
    ]);
    if (stdout) return stdout.trim().toLowerCase();
    else throw new Error("Failed to hash file");
}

export async function hashRvz(file: string): Promise<string> {
    setupBinary();
    const hash = await dolphinTool.verify({
        inputFilename: file,
        digestAlgorithm: DigestAlgorithm.RCHASH,
    });
    if (hash.rchash) return hash.rchash;
    else throw new Error("Failed to hash RVZ file");
}
