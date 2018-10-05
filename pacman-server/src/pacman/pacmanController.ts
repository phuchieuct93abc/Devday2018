import { UP, DOWN, LEFT, RIGHT } from "./pacmanConst";
import Pacman from "./pacman";
const CONTROL_CODES = {
    up: UP,
    down: DOWN,
    left: LEFT,
    right: RIGHT
}
class PacmanController {
    constructor() { }
    startGameplayNoGhost() {
        window.setTimeout(() => {
            var el = document.getElementById("pacman");
            Pacman.init(el, "https://raw.githubusercontent.com/daleharvey/pacman/master/");
        }, 0);

    }
    startGameplayWithGhost() {

        window.setTimeout(() => {
            var el = document.getElementById("pacman");
            Pacman.init(el, "https://raw.githubusercontent.com/daleharvey/pacman/master/");

        }, 0);

    }

    setPlayer(players) {
        Pacman.registerPlayers(players)
    }



    move(playerId, direction) {
        Pacman.move(playerId - 1, CONTROL_CODES[direction])
    }
    startNewGame() {
        setTimeout(() => {
            Pacman.startNewGame();
        }, 3000)

    }

}

export default new PacmanController();