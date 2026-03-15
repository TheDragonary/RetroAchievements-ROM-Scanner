# RetroAchievements ROM Scanner (ra-scan)

![npm](https://img.shields.io/npm/v/ra-scan)
![downloads](https://img.shields.io/npm/dt/ra-scan)
![license](https://img.shields.io/github/license/TheDragonary/RetroAchievements-ROM-Scanner)

A command-line tool that scans your ROM library and matches each file with its corresponding RetroAchievements entry using the RetroAchievements API.

It calculates ROM hashes and compares them against the official RetroAchievements database to identify which games in your collection support achievements on [RetroAchievements](https://retroachievements.org/).

Useful for verifying large ROM collections and quickly identifying which games support RetroAchievements.

Supports ROM libraries for NES, SNES, N64, Game Boy, PlayStation, and many other retro systems.

## Contents
- [Quick Start](#quick-start)
- [RetroAchievements API Key](#retroachievements-api-key)
- [Download](#download)
- [Usage](#usage)
- [Features](#features)
- [Supported Systems](#supported-systems)
- [Output](#output)
- [Folder Structure](#folder-structure)
- [Cache Structure](#cache-structure)
- [Getting Started](#getting-started)

## Quick Start

Run the scanner without installing anything:

```bash
npx ra-scan -k YOUR_API_KEY ./ROMs/
```

## RetroAchievements API Key

An API key is required to query the RetroAchievements database.

1. Create an account at https://retroachievements.org
2. Open your user settings
3. Generate an API key
4. Pass it to the scanner:

```bash
ra-scan -k YOUR_API_KEY ./ROMs/
```

## Download

If you prefer to run the tool without Node.js, download a precompiled binary from [Releases](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner/releases).

If you want to run it using Node.js, see the [Getting Started](#getting-started) section below.

We also provide an [NPM package](https://www.npmjs.com/package/ra-scan).

- [Windows](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner/releases/latest/download/ra-scan-windows-x64.zip)
- [Linux](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner/releases/latest/download/ra-scan-linux-x64.tar.gz)

## Usage

```bash
Usage: ra-scan [options] <roms>

Arguments:
  roms                 ROM folder to scan

Options:
  -V, --version        output the version number
  -k, --api-key <key>  RetroAchievements API key
  -C, --clear-cache    clear API and scan cache before scanning
  -H, --clear-history  clear stored ROM hash history
  -h, --help           display help for command
```

### Examples:

Scan a folder:
```bash
ra-scan -k YOUR_API_KEY ./ROMs/
```

Clear cache + history and rescan:
```bash
ra-scan -k YOUR_API_KEY -C -H ./ROMs/
```

Windows:
```pwsh
.\ra-scan.exe -k YOUR_API_KEY ./ROMs/
```

## Features

- Scans a ROM library and detects games that support RetroAchievements
- Uses the official RetroAchievements hash database
- Supports compressed disc formats such as `.chd` and `.rvz`
- Automatically detects console from folder name or file extension
- Caches RetroAchievements console and game data
- Caches previously calculated ROM hashes for faster rescans
- Generates lists of supported and unsupported games
- Detects duplicate games

## Supported Systems

| System                    | Formats                 |
|---------------------------|-------------------------|
| NES                       | `.nes`                  |
| SNES                      | `.sfc`, `.smc`          |
| Nintendo 64               | `.n64`, `.z64`, `.v64`  |
| Game Boy / Color          | `.gb`, `.gbc`           |
| Game Boy Advance          | `.gba`                  |
| Nintendo DS / DSi         | `.nds`                  |
| Nintendo GameCube         | `.iso`, `.rvz`          |
| Nintendo Wii              | `.iso`, `.rvz`          |
| PlayStation               | `.bin`, `.cue`, `.chd`  |
| PlayStation 2             | `.iso`, `.chd`          |
| PlayStation Portable      | `.iso`, `.cso`          |
| Sega Genesis / Mega Drive | `.gen`, `.md`, `.bin`   |
| Sega Master System        | `.sms`                  |

*And more systems supported by RetroAchievements.*

## Output

The script will:
- Scan all ROM files inside the ROMs directory
- Detect the console for each ROM
- Calculate the RetroAchievements hash
- Compare the hash against the official database
- Cache API responses locally
- Cache calculated ROM hashes
- Output supported and unsupported games
- Duplicate ROMs are automatically detected and reported
- Display total supported games
- Save results to text files

Example output:

```bash
ra-scan -k YOUR_API_KEY ./ROMs/
```

```bash
✅ NES      Super Mario Bros. (World).nes -> Super Mario Bros.
🔄 SNES     Chrono Trigger (USA).sfc -> Hashing...
❌ SNES     Super Mario World (Europe).sfc -> Not supported

Scan complete

Supported games: 200
Unsupported games: 10
```

## Folder Structure

```bash
ROMs/
 ├─ NES/
 │   └─ Super Mario Bros. (World).nes
 ├─ SNES/
 │   └─ Chrono Trigger (USA).sfc
 ├─ NDS/
 │   └─ New Super Mario Bros. (Europe) (En,Fr,De,Es,It).nds
 ├─ GC/
 │   └─ Animal Crossing (USA, Canada).rvz
 └─ PSX/
     └─ Final Fantasy VII (USA) (Disc 1).chd
```

## Cache Structure

```bash
~/.cache/ra-scan-nodejs/
 ├─ api/      RetroAchievements API data
 ├─ scan/     scan results
 └─ history/  previously calculated ROM hashes
```
*Location may vary depending on your operating system.*

## Getting Started

### Install with Node.js

Clone the repo
```bash
git clone https://github.com/TheDragonary/RetroAchievements-ROM-Scanner.git
```

Install dependencies
```bash
npm install
```

Run the script
```bash
npm run start -- -k YOUR_API_KEY ./ROMs/
```
