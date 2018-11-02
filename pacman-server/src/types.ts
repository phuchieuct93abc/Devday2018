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

export {PlayerData, RestData, Color};