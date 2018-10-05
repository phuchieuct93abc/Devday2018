interface IPlayer {
    token: string,
    playerId: string,
    playerName: string,
    playerColor: string
}
let playerStorage: IPlayer[] = [{
    token: "1",
    playerId: "1",
    playerName: "Hieu Lam",
    playerColor: "#ff0000"
}, {
    token: "2",
    playerId: "2",
    playerName: "Hung Nguyen",
    playerColor: "#00ff18"
}]
export { playerStorage, IPlayer };
