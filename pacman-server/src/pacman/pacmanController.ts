import { UP, DOWN, LEFT, RIGHT } from "./pacmanConst";
import Pacman from "./pacman";
import Player from "@/player";
const CONTROL_CODES = {
    up: UP,
    down: DOWN,
    left: LEFT,
    right: RIGHT
}
class PacmanController {
    private players!: Player[];
    constructor() { }

    startGameWithNoGhost() {

        var el = document.getElementById("pacman");
        Pacman.init(el, "https://raw.githubusercontent.com/daleharvey/pacman/master/");
        this.startNewGame();

    }
    startGameplayWithGhost() {
        var el = document.getElementById("pacman");
        Pacman.init(el, "https://raw.githubusercontent.com/daleharvey/pacman/master/");
        return this;
    }

    setPlayer(players: Player[]) {
        this.players = players;
        Pacman.registerPlayers(players)
        return this;
    }

    move(player: Player, direction) {
        let playerIndex = this.players.indexOf(player);
        Pacman.move(playerIndex, CONTROL_CODES[direction])
    }
    private startNewGame() {
        setTimeout(() => {
            Pacman.startNewGame();
        }, 3000);
    }
}

export default new PacmanController();


