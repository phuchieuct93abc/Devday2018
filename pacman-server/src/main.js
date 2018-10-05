//This script is used for team fighting
import PacmanController from "./pacman";

import "./assets/css/app.css";
import Player from "./player"
import $ from "jquery"

const player1Token = "1";
const player2Token = "2"

$(() => {

    let player1 = Player.getPlayerByToken(player1Token);
    let player2 = Player.getPlayerByToken(player2Token);

    PacmanController.startGameplayNoGhost();
    PacmanController.setPlayer([player1, player2])
    PacmanController.startNewGame()


    var socket = io(); 
    socket.on('action', function (action) {
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
