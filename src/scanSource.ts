import { path7za } from "7zip-bin";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import type { ScanFile } from "./types.js";

try {
    fs.chmodSync(path7za, 0o755);
} catch (e) {}

const ARCHIVE_EXTS = [".zip", ".7z", ".rar"];

function isArchive(file: string): boolean {
    return ARCHIVE_EXTS.some(ext => file.toLowerCase().endsWith(ext));
}

async function listArchive(input: string): Promise<{ name: string; size: number }[]> {
    return new Promise((resolve, reject) => {
        const proc = spawn(path7za, ["l", "-slt", input]);

        let output = "";
        proc.stdout.on("data", (d) => (output += d.toString()));
        proc.stderr.on("data", (d) => console.error(d.toString()));

        proc.on("close", (code) => {
            if (code !== 0) return reject(new Error("7z list failed"));

            const files: { name: string; size: number }[] = [];

            const blocks = output.split("\n\n");
            for (const block of blocks) {
                const lines = block.split("\n");
                let name = "";
                let size = 0;

                for (const line of lines) {
                    if (line.startsWith("Path = ")) name = line.slice(7).trim();
                    if (line.startsWith("Size = ")) size = parseInt(line.slice(7).trim(), 10);
                }

                if (name && size > 0) files.push({ name, size });
            }

            resolve(files);
        });
    });
}

function streamFromArchive(archive: string, file: string): NodeJS.ReadableStream {
    const proc = spawn(path7za, ["e", "-so", archive, file]);
    if (!proc.stdout) throw new Error("Failed to get stdout from 7z");
    return proc.stdout;
}

export async function* scanSource(input: string, root: string = input): AsyncGenerator<ScanFile> {
    const relative = path.relative(root, input).replace(/\\/g, "/");
    const stat = fs.statSync(input);

    if (stat.isDirectory()) {
        for (const file of fs.readdirSync(input)) {
            yield* scanSource(path.join(input, file), root);
        }
        return;
    }

    if (isArchive(input)) {
        const files = await listArchive(input);

        for (const file of files) {
            if (/\/$/.test(file.name)) continue;

            yield {
                path: file.name.replace(/\\/g, "/"),
                size: file.size,
                source: input,
                internalPath: file.name,
                getStream: () => streamFromArchive(input, file.name),
            };
        }

        return;
    }

    yield {
        path: relative,
        size: stat.size,
        source: input,
        realPath: input,
    };
}
