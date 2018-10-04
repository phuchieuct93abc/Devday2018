import PacmanController from "./pacman"
import PlayerStorage from "./playerStorage"
export default class Player {

    constructor(token, playerId, playerName, playerColor) {
        this.token = token;
        this.playerId = playerId;
        this.playerColor = playerColor;
        this.playerName = playerName;
    }

    score() {
        console.log(`${this.playerId} score`)
    }
    move(direction) {
        console.log(`${this.playerId} move`)
        PacmanController.move(this.playerId, direction);
    }
    static getPlayerByToken(token) {
        let { playerId, playerName, playerColor } = PlayerStorage.find(player => player.token == token)
        return new Player(token, playerId, playerName, playerColor);
    }
}