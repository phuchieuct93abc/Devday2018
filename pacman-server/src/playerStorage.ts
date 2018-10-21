interface PlayerData {
    id: string,
    token: string,
    name: string,
    color: string,
    score: number
}

interface RestData {
    token: string,
    action: string,
}

export {PlayerData, RestData};
