import { UP, DOWN, LEFT, RIGHT } from "@/pacman/pacmanConst";
import Player from "@/player";
import PACMAN from '@/pacman/pacman';
import $ from "jquery";

const CONTROL_CODES = {
    up: UP,
    down: DOWN,
    left: LEFT,
    right: RIGHT
};

class PacmanController {
    private players!: Player[];
    pacman:any = null;
    constructor() {
        this.pacman = PACMAN();
    }

    startGame() {
        const el = document.getElementById("pacman");
        $("#pacman").children("canvas").remove();
        this.pacman.init(el, "./");
        this.startNewGame();
    }

    setPlayer(players: Player[]) {
        this.players = players;
        this.pacman.registerPlayers(players);
        return this;
    }

    setGhost() {
        this.pacman.setGhost(["#FF0000", "#FFB847"]);
        // Pacman.setGhost(["#00FFDE","#FF0000"]);
        return this;
    }

    setNoGhost() {
        this.pacman.setGhost([]);
        return this;
    }

    move(player: Player, direction) {
        const playerIndex = this.players.indexOf(player);
        this.pacman.move(playerIndex, CONTROL_CODES[direction])
    }
    stop(){
        this.pacman.stop();
    }

    private startNewGame() {
        setTimeout(this.pacman.startNewGame, 3000);
    }
}

export default PacmanController;


