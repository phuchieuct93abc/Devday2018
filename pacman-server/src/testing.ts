//This script is used in index.html for testing.
//This page will be ginven to team for testing purpose, work with query param token
import "./assets/css/app.css";
import PacmanController from "./pacman/pacmanController";
import Player from "./player"
import * as $ from "jquery";
var urlParams = new URLSearchParams(window.location.search);
var token = urlParams.get('token');

if (token) {

    $(() => {
        let player = Player.getPlayerByToken(token);
        PacmanController.setPlayer([player]).startGameWithNoGhost();

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