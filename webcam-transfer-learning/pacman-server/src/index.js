import pacman from "./pacman";


$(() =>{
    var socket = io();
    socket.on('action', function (action) {
        let direction = action.action;
        let player = action.player
        pacman.move(player,direction);

    });
});
setTimeout( () =>{
    pacman.startGameplayNoGhost(); 
}, 1000)
