interface IPlayerDataSource {
    id: string,
    token: string,
    name: string,
    color: string
}

let playerDataSource: IPlayerDataSource[] = [{
    id: "1",
    token: "1",
    name: "Hieu Lam",
    color: "#ff0000"
}, {
    id: "2",
    token: "2",
    name: "Hung Nguyen",
    color: "#00ff18"
}];

export {playerDataSource, IPlayerDataSource};
