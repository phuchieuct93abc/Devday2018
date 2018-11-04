interface PlayerData {
    id: string,
    token: string,
    name: string,
    color: Color,
    score: number
}

interface RestData {
    token: string,
    action: string,
}

interface Color {
    text: string,
    value: string,
}

interface AudioFile {
    event: string,
    path: string
}

interface Point {
    x: number,
    y: number
}

export {PlayerData, RestData, Color, AudioFile, Point};
