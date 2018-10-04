import PacmanController from "./pacman"
import PlayerStorage from "./playerStorage"
import $ from "jquery"
export default class Player {

    constructor(token, playerId, playerName, playerColor) {
        this.token = token;
        this.playerId = playerId;
        this.playerColor = playerColor;
        this.playerName = playerName;

        this.playerNameElement = $(`#player${playerId}`);
        this.playerNameElement.text(this.playerName);
        this.playerNameElement.css({"color":this.playerColor});
        this.playerNameElement.hide();
    }

    score() {
        console.log(`${this.playerId} score`)
    }
    move(direction) {
        PacmanController.move(this.playerId, direction);
    }
    moveName(positionX, positionY) {
        this.playerNameElement.show();
        this.playerNameElement.css({ left: positionX - 10, top: positionY - 30 })

    }
    static getPlayerByToken(token) {
        let { playerId, playerName, playerColor } = PlayerStorage.find(player => player.token == token)
        return new Player(token, playerId, playerName, playerColor);
    }
}