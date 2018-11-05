import {UP, DOWN, LEFT, RIGHT} from "@/pacman/pacmanConst";
import Pacman from "@/pacman/pacman";
import Player from "@/player";

const CONTROL_CODES = {
    up: UP,
    down: DOWN,
    left: LEFT,
    right: RIGHT
};

class PacmanController {
    private players!: Player[];

    constructor() {
    }

    startGame() {
        const el = document.getElementById("pacman");
        Pacman.init(el, "./");
        this.startNewGame();
    }

    setPlayer(players: Player[]) {
        this.players = players;
        Pacman.registerPlayers(players);
        return this;
    }

    setGhost() {
         Pacman.setGhost(["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"]);
        // Pacman.setGhost(["#00FFDE","#FF0000"]);
        return this;
    }

    setNoGhost() {
        Pacman.setGhost([]);
        return this;
    }

    move(player: Player, direction) {
        const playerIndex = this.players.indexOf(player);
        Pacman.move(playerIndex, CONTROL_CODES[direction])
    }

    private startNewGame() {
        setTimeout(Pacman.startNewGame, 3000);
    }
}

export default new PacmanController();


