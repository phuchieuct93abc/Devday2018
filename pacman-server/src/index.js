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

})
