import $ from "jquery";
import pacmanController from "./pacman/pacmanController";
import {IPlayerDataSource, playerDataSource} from "./playerStorage";

export default class Player {

    playerNameElement: JQuery<HTMLElement>;
    score: number = 0;
    id: string;
    color: string;
    token: string;
    name: string;

    constructor(dataSource: IPlayerDataSource) {
        this.id = dataSource.id;
        this.name = dataSource.name;
        this.token = dataSource.token;
        this.color = dataSource.color;
        this.playerNameElement = $(`#player${this.id}`);
        if (this.playerNameElement.length == 0) {
            this.playerNameElement = $(`#player`);

        }
        this.playerNameElement.css({"color": this.color}).hide().find(".player-name").text(this.name);
    }

    updateScore(score: number): any {
        this.score = score;
        this.playerNameElement.find(".player-name").text(`${this.name}: ${score}`);
    }

    move(direction: string) {
        pacmanController.move(this, direction);
    }

    moveName(positionX: number, positionY: number) {
        this.playerNameElement.show();
        this.playerNameElement.css({left: positionX, top: positionY - 40})

    }

    static getPlayerByToken(token: string) {
        let playerData: IPlayerDataSource = playerDataSource.filter(player => player.token == token)[0];
        return new Player(playerData);
    }
}