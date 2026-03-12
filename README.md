# RetroAchievements ROM Scanner

A tool that scans your ROM library and matches each file with its corresponding RetroAchievements entry using the RetroAchievements API.

It calculates ROM hashes and compares them against the official RetroAchievements hash database to identify which games in your collection support achievements.

## Download

If you prefer to use Node.js, go to [Getting Started](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner?tab=readme-ov-file#getting-started) and follow the instructions there. Otherwise, you can download the precompiled binaries from [Releases](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner/releases). We also have an [NPM package](https://www.npmjs.com/package/ra-scan) available too.

- [Windows](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner/releases/latest/download/ra-scan-windows-x64.zip)
- [Linux](https://github.com/TheDragonary/RetroAchievements-ROM-Scanner/releases/latest/download/ra-scan-linux-x64.tar.gz)

## Features

- Scans a ROM library and detects supported RetroAchievements games
- Uses the official RetroAchievements hash database
- Supports compressed and disc formats (CHD, RVZ)
- Automatically detects console from folder name or file extension
- Caches RetroAchievements console and game data
- Caches previously calculated ROM hashes for faster rescans
- Generates lists of supported and unsupported games
- Detects duplicate games

## Supported Systems

- NES / Famicom Disk System
- SNES
- Nintendo 64
- Game Boy / Color / Advance
- Nintendo DS / DSi
- Nintendo GameCube
- Nintendo Wii
- Sega Genesis / Mega Drive
- PlayStation
- PlayStation 2
- PlayStation Portable

## Output

The script will:
- Scan all ROM files inside the ROMs directory
- Detect the console for each ROM
- Calculate the RetroAchievements hash
- Compare the hash against the official database
- Cache API responses locally
- Cache calculated ROM hashes
- Output supported, unsupported games and any duplicates
- Display total supported games
- Save results to text files

Example output:
```
✅ NES      Super Mario Bros. (World).nes -> Super Mario Bros.
✅ SNES     Chrono Trigger (USA).sfc -> Chrono Trigger
❌ SNES     Super Mario World (Europe).sfc -> Not supported
```

## Getting Started

### Run with npx

Make sure Node.js is installed on your system, then run the script using `npx`.

```
npx ra-scan ROMs/ -k YOUR_API_KEY
```

### Install with Node.js

Make sure Node.js is installed on your system.

Clone the repo
```
git clone https://github.com/TheDragonary/RetroAchievements-ROM-Scanner.git
```

Install dependencies
```
npm install
```

Place your ROMs inside a folder. Folder names should match the entries in `consoleMap`. Example structure:
```
ROMs/
    NES/
        Super Mario Bros. (World).nes
    SNES/
        Chrono Trigger (USA).sfc
    NDS/
        New Super Mario Bros. (Europe) (En,Fr,De,Es,It).nds
    GC/
        Animal Crossing (USA, Canada).rvz
    PSX/
        Final Fantasy VII (USA) (Disc 1).chd
```

Run the script. Make sure to specify the path to your ROMs folder and supply your RetroAchievements API key. Subsequent runs don't require an API key as all data is stored in cache.
```
npm run start ROMs/ --api-key YOUR_API_KEY
```
