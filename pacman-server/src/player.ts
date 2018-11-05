import $ from "jquery";
import {Color, PlayerData} from "./types";
import PacmanController from './pacman/pacmanController';

export default class Player implements PlayerData {

    playerNameElement: JQuery<HTMLElement>;
    id: string;
    color: Color;
    token: string;
    name: string;
    score: number = 0;

    constructor(dataSource: PlayerData) {
        this.id = dataSource.id;
        this.name = dataSource.name;
        this.token = dataSource.token;
        this.color = dataSource.color;
        this.playerNameElement = $(`#player-${this.id}`);
        if (this.playerNameElement.length == 0) {
            this.playerNameElement = $(`#player`);

        }
        this.playerNameElement.css({"color": this.color.value}).hide().find(".player-name").text(this.name);
        this.updateScore(0);
    }

    updateScore(score: number): any {
        this.score = score;
        this.playerNameElement.find(".player-name").text(`${this.name}: ${score}`);
    }

    move(direction: string,pacmanController:PacmanController) {
        pacmanController.move(this, direction);
    }

    moveName(positionX: number, positionY: number) {
        this.playerNameElement.show();
        this.playerNameElement.css({left: positionX, top: positionY - 40})

    }

    static fromPlayerData(data: PlayerData) {
        return new Player(data);
    }
}