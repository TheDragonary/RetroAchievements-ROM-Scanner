import { execFile } from "child_process";
import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { APP_DIR } from "./paths.js";

const execFileAsync = promisify(execFile);

const HASHER = path.join(APP_DIR, "bin", process.platform === "win32" ? "RAHasher.exe" : "RAHasher");
const DOLPHIN_TOOL = path.join(APP_DIR, "bin", process.platform === "win32" ? "DolphinTool.exe" : "dolphin-tool");

if (!fs.existsSync(HASHER)) throw new Error(`RAHasher binary not found at ${HASHER}`);
if (!fs.existsSync(DOLPHIN_TOOL)) throw new Error(`DolphinTool binary not found at ${DOLPHIN_TOOL}`);

export async function raHash(consoleId: number, file: string): Promise<string> {
    const { stdout } = await execFileAsync(HASHER, [
        consoleId.toString(),
        file,
    ]);
    if (stdout) return stdout.trim().toLowerCase();
    else throw new Error("Failed to hash file");
}

export async function hashRvz(file: string): Promise<string> {
    const { stdout } = await execFileAsync(DOLPHIN_TOOL, [
        "verify", "-a", "rchash", "-i",
        file,
    ]);
    if (stdout) return stdout.trim().toLowerCase();
    else throw new Error("Failed to hash RVZ file");
}

export async function raHashInput(
    consoleId: number,
    input: string | NodeJS.ReadableStream,
    filename: string
): Promise<string> {
    const ext = filename ? path.extname(filename).toLowerCase() : "";

    if (typeof input === "string") {
        if (ext === ".rvz") return hashRvz(input);
        return raHash(consoleId, input);
    }

    const tempPath = path.join(os.tmpdir(), `rom-${randomUUID()}-${filename ?? "temp.rom"}`);

    await new Promise((resolve, reject) => {
        const write = fs.createWriteStream(tempPath);
        input.pipe(write);
        input.on("error", reject);
        write.on("finish", resolve);
        write.on("error", reject);
    });

    try {
        if (ext === ".rvz") return await hashRvz(tempPath);
        return await raHash(consoleId, tempPath);
    } finally {
        await fs.promises.unlink(tempPath).catch(() => {});
    }
}
