import googlea from "./packman";
let CONTROL_CODES = {
    1: {
        up: 38,
        down: 40,
        left: 37,
        right: 39
    },
    2: {
        up: 87,
        down: 83,
        left: 65,
        right: 68
    }
}
$( () =>{
    var socket = io();


    socket.on('action', function (action) {
        let direction = action.action;
        let player = action.player
        google.pacman.keyPressed(CONTROL_CODES[player][direction]);

    });
});
setTimeout( () =>{
    google.pacman.switchToDoubleMode();
    google.pacman.startGameplay(); 
}, 2000)
