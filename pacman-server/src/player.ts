import $ from "jquery";
import pacmanController from "./pacman/pacmanController";
import {IPlayerDatasource, playerDataSource} from "./playerStorage";

import Store from './store';

export default class Player {

    playerNameElement: JQuery<HTMLElement>;
    score: number = 0;
    id: string;
    color: string;
    token: string;
    name: string;

    constructor(dataSource: IPlayerDatasource) {
        this.id = dataSource.playerId;
        this.name = dataSource.playerName;
        this.token = dataSource.token;
        this.color = dataSource.playerColor;
        this.playerNameElement = $(`#player${this.id}`);
        if (this.playerNameElement.length == 0) {
            this.playerNameElement = $(`#player`);

        }
        this.playerNameElement.css({"color": this.color}).hide().find(".player-name").text(this.name);
    }

    updateScore(score: number): any {
        this.score = score;
        Store.commit("updateScoreSecondPlayer", score);
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
        let playerData: IPlayerDatasource = playerDataSource.filter(player => player.token == token)[0];
        return new Player(playerData);
    }
}