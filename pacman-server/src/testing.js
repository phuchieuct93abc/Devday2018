//This script is used in index.html for testing.
//This page will be ginven to team for testing purpose, work with query param token
import "./assets/css/app.css";
import PacmanController from "./pacman";
import Player from "./player"
import $ from "jquery"
var urlParams = new URLSearchParams(window.location.search);
var token = urlParams.get('token');

if (token) {
    $(() => {
        let player = Player.getPlayerByToken(token);

        PacmanController.startGameplayNoGhost();
        PacmanController.setPlayer([player])
        PacmanController.startNewGame()

        var socket = io();
        socket.on('action', function (action) {
            if (action.token == token) {
                player.move(action.action)
            }
        });
    })
} else {
    $("#pacman").text("Please put token in url like ?token=ABC")
}