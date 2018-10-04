//This script is used in index.html for testing.
//This page will be ginven to team for testing purpose, work with query param token
import  "./assets/css/app.css";
import PacmanController from "./pacman";
var urlParams = new URLSearchParams(window.location.search);
var token = urlParams.get('token');
if (token) {
    $(() => {
        PacmanController.startGameplayNoGhost();
        PacmanController.setNumberOfPlayer(1)
        PacmanController.startNewGame()
    })
} else {
    $("#pacman").text("Please put token in url like ?token=ABC")
}

$(() => {
    var socket = io();
    socket.on('action', function (action) {
        if (action.player == token) {
            let direction = action.action;
            PacmanController.move(1, direction);//Always move 1st pacman 
        }
    });
});