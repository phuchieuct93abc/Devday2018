
import "./assets/css/app.css";
import Player from "./player"
import * as $ from "jquery";
import pacmanController from "./pacman/pacmanController";

const player1Token:string = "1";
const player2Token:string = "2"

$(() => {

    let player1:Player = Player.getPlayerByToken(player1Token);
    let player2 :Player= Player.getPlayerByToken(player2Token);
    pacmanController.setPlayer([player1, player2]).startGameWithNoGhost();

    var socket = io(); 
    socket.on('action', (action:any) =>{
        let token = action.token;
        let player;
        if (token == player1.token) {
            player = player1;
        }
         else if (token == player2.token) {
            player = player2;
        } else {
            return;
        }
        player.move(action.action);
    });
});
