import type { SystemDetection } from "./types.js";

export const systems: SystemDetection[] = [
  // Nintendo
  { id: 7, shortName: "NES", names: ["nes", "famicom", "nintendo entertainment system"], extensions: [".nes"] },
  { id: 81, shortName: "FDS", names: ["fds", "famicom disk system"], extensions: [".fds"] },
  { id: 3, shortName: "SNES", names: ["snes", "super nintendo", "super famicom", "super nintendo entertainment system"], extensions: [".sfc", ".smc"] },
  { id: 2, shortName: "N64", names: ["n64", "nintendo 64"], extensions: [".z64", ".n64", ".v64"] },
  { id: 4, shortName: "GB", names: ["gb", "gameboy", "game boy"], extensions: [".gb"] },
  { id: 6, shortName: "GBC", names: ["gbc", "gameboy color", "game boy color"], extensions: [".gbc"] },
  { id: 5, shortName: "GBA", names: ["gba", "gameboy advance", "game boy advance"], extensions: [".gba"] },
  { id: 18, shortName: "DS", names: ["ds", "nds", "nintendo ds"], extensions: [".nds"] },
  { id: 78, shortName: "DSI", names: ["dsi"], extensions: [".nds"] },
  { id: 62, shortName: "3DS", names: ["3ds"], extensions: [".3ds", ".cia"] },
  { id: 16, shortName: "GC", names: ["gamecube", "gc"], extensions: [".iso", ".gcm", ".rvz"] },
  { id: 19, shortName: "WII", names: ["wii"], extensions: [".iso", ".wbfs", ".rvz"] },
  { id: 20, shortName: "WII U", names: ["wiiu", "wii u"], extensions: [".wud", ".wux"] },
  { id: 28, shortName: "VIRTUAL BOY", names: ["virtual boy"], extensions: [".vb"] },

  // Sega
  { id: 1, shortName: "GENESIS", names: ["genesis", "mega drive", "megadrive", "md"], extensions: [".md", ".gen", ".bin"] },
  { id: 11, shortName: "MASTER SYSTEM", names: ["master system", "sms"], extensions: [".sms"] },
  { id: 15, shortName: "GAME GEAR", names: ["game gear", "gg"], extensions: [".gg"] },
  { id: 9, shortName: "SEGA CD", names: ["sega cd"], extensions: [".cue", ".chd"] },
  { id: 10, shortName: "3DX", names: ["32x"], extensions: [".32x", ".bin"] },
  { id: 39, shortName: "SATURN", names: ["saturn"], extensions: [".cue", ".chd"] },
  { id: 40, shortName: "DREAMCAST", names: ["dreamcast"], extensions: [".gdi", ".cdi", ".chd"] },

  // Sony
  { id: 12, shortName: "PS1", names: ["psx", "ps1", "playstation"], extensions: [".cue", ".bin", ".chd"] },
  { id: 21, shortName: "PS2", names: ["ps2", "playstation2", "playstation 2"], extensions: [".iso", ".chd"] },
  { id: 41, shortName: "PSP", names: ["psp"], extensions: [".iso", ".cso"] },

  // NEC
  { id: 8, shortName: "PC ENGINE", names: ["pc engine", "turbografx", "tg16"], extensions: [".pce"] },
  { id: 76, shortName: "PC ENGINE CD", names: ["pc engine cd", "turbografx cd"], extensions: [".cue", ".chd"] },

  // SNK
  { id: 56, shortName: "NEO GEO CD", names: ["neo geo cd"], extensions: [".cue", ".chd"] },

  // Atari
  { id: 25, shortName: "ATARI 2600", names: ["atari 2600"], extensions: [".a26"] },
  { id: 51, shortName: "ATARI 7800", names: ["atari 7800"], extensions: [".a78"] },
  { id: 13, shortName: "LYNX", names: ["lynx"], extensions: [".lnx"] },
  { id: 17, shortName: "JAGUAR", names: ["jaguar"], extensions: [".j64", ".jag"] },

  // Arcade
  { id: 27, shortName: "ARCADE", names: ["arcade", "mame"], extensions: [".zip"] },
];
