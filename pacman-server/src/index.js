import PacmanController from "./pacman";

import app from "./assets/css/app.css";
import styles from "./assets/css/styles.css";

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
