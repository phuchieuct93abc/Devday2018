//This script is used for team fighting
import PacmanController from "./pacman";

$(() => {
    var socket = io();
    socket.on('action', function (action) {
        let direction = action.action;
        let player = action.player
        PacmanController.move(player, direction);
    });
});
$(()=>{
    PacmanController.startGameplayNoGhost();
    PacmanController.setNumberOfPlayer(2)
    PacmanController.startNewGame()
})
