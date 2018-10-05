import * as $ from "jquery";
import pacmanController from "./pacman/pacmanController";
import { playerStorage } from "./playerStorage";

export default class Player {

    playerNameElement:JQuery<HTMLElement>
    constructor(public token:string,public playerId:string, public playerName:string,public playerColor:string) {
        this.playerNameElement = $(`#player${playerId}`);
        this.playerNameElement.find(".player-name").text(this.playerName);
        this.playerNameElement.css({"color":this.playerColor});
        this.playerNameElement.hide();
    }

    score() {
        console.log(`${this.playerId} score`)
    }
    move(direction:string) {
        pacmanController.move(this.playerId, direction);
    }
    moveName(positionX:number, positionY:number) {
        this.playerNameElement.show();
        this.playerNameElement.css({ left: positionX, top: positionY - 40 })

    }
    static getPlayerByToken(token:string) {
        let { playerId, playerName, playerColor } = playerStorage.filter((player:any) => player.token == token)[0];
        return new Player(token, playerId, playerName, playerColor);
    }
}