import pacmanv2 from "./pacnmanv2";

import pacman from "./pacman";

import app from "./assets/css/app.css";
import styles from "./assets/css/styles.css";


$(() => {
    var socket = io();
    socket.on('action', function (action) {
        let direction = action.action;
        let player = action.player
        pacmanv2.move(player, direction);
        pacman.move(player, direction);
    });
});
setTimeout(() => {
    pacmanv2.startGameplayNoGhost();
    pacman.startGameplayNoGhost();
}, 2000)