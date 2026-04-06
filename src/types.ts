export type SystemDetection = {
    id: number;
    shortName: string;
    names: string[];
    extensions: string[];
};

export interface Console {
    ID: number;
    Name: string;
    IconURL: string;
    Active: boolean;
    IsGameSystem: boolean;
}

export interface Game {
    Title: string;
    ID: number;
    ConsoleID: number;
    ConsoleName: string;
    ImageIcon: string;
    NumAchievements: number;
    NumLeaderboards: number;
    Points: number;
    DateModified: string;
    ForumTopicID: number;
    Hashes: string[];
}

export type ScanFile = {
    path: string;
    size: number;
    source: string;
    realPath?: string;
    internalPath?: string;
    getStream?: () => NodeJS.ReadableStream;
};
