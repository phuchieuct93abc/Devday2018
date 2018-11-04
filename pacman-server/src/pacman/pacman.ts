// import Modernizr from 'modernizr'

import PacmanUser from "@/pacman/pacmanUser";
import Player from "@/player";
import PacmanUsers from "@/pacman/PacmanUsers";
import {COUNTDOWN, DYING, EATEN_PAUSE, FPS, KEY, PAUSE, PLAYING, WAITING} from "@/pacman/pacmanConst";
import PacmanAudio from "@/pacman/PacmanAudio";
import PacmanGhost from "@/pacman/PacmanGhost";
import PacmanMap from "@/pacman/PacmanMap";
import {AudioFile, Point} from "@/types";
import {YELLOW} from "@/defined-color";

var PACMAN = (function () {

    let state: number = WAITING;
    let audio: PacmanAudio;
    let ghosts: PacmanGhost[] = [];
    let ghostSpecs: string[] = [];
    let eatenCount: number = 0;
    let level: number = 0;
    let tick: number = 0;
    let ghostPos: any;
    let userPos: any;
    let stateChanged: boolean = true;
    let timerStart!: number;
    let lastTime: number = 0;
    let canvasContext: any = null;
    let timer: number;
    let mapMaze: PacmanMap;
    let users: PacmanUsers;
    let stored: number;
    let players: Player[] = [];

    function setGhost(ghostColors: string[]) {
        ghostSpecs = ghostColors;
    }

    function getTick() {
        return tick;
    }

    function drawScore(text, position) {
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.font = "12px BDCartoonShoutRegular";
        canvasContext.fillText(text,
            (position["new"]["x"] / 10) * mapMaze.blockSize,
            ((position["new"]["y"] + 5) / 10) * mapMaze.blockSize);
    }

    function dialog(text: string) {
        canvasContext.fillStyle = YELLOW.value;
        canvasContext.font = "35px Calibri";
        var width = canvasContext.measureText(text).width,
            x = ((mapMaze.width * mapMaze.blockSize) - width) / 2;
        canvasContext.fillText(text, x, (mapMaze.height * 10) + 8);
    }

    function soundDisabled() {
        return localStorage["soundDisabled"] === "true";
    }

    function startLevel() {
        users.resetPosition();
        for (var i = 0; i < ghosts.length; i += 1) {
            ghosts[i].reset();
        }
        audio.play("start");
        timerStart = tick;
        setState(COUNTDOWN);
    }

    function startNewGame() {
        setState(WAITING);
        level = 1;
        users.reset();
        mapMaze.reset();
        mapMaze.draw(canvasContext);
        startLevel();
    }

    function move(userIndex, direction) {
        return users.keyDown(userIndex, direction);
    }

    function loseLife() {
        setState(WAITING);
        users.loseLife();
        if (users.getLives() > 0) {
            startLevel();
        }
    }

    function setState(nState) {
        state = nState;
        stateChanged = true;
    }

    function collided(user, ghost: Point) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) + Math.pow(ghost.y - user.y, 2))) < 10;
    }

    function redrawBlock(pos) {
        mapMaze.drawBlock(Math.floor(pos.y / 10), Math.floor(pos.x / 10), canvasContext);
        mapMaze.drawBlock(Math.ceil(pos.y / 10), Math.ceil(pos.x / 10), canvasContext);
    }

    function mainDraw() {
        let nScore;
        ghostPos = [];

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghostPos.push(ghosts[i].move(canvasContext));
        }
        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            redrawBlock(ghostPos[i].old);
        }
        let userPos = users.move();
        userPos.forEach(pos => redrawBlock(pos.old));

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghosts[i].draw(canvasContext);
        }
        users.draw(canvasContext);

        userPos = userPos["new"];

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            if (collided(userPos, ghostPos[i]["new"])) {
                if (ghosts[i].isVunerable()) {
                    audio.play("eatghost");
                    ghosts[i].eat();
                    eatenCount += 1;
                    nScore = eatenCount * 50;
                    drawScore(nScore, ghostPos[i]);
                    users.addScore(nScore);
                    setState(EATEN_PAUSE);
                    timerStart = tick;
                } else if (ghosts[i].isDangerous()) {
                    audio.play("die");
                    setState(DYING);
                    timerStart = tick;
                }
            }
        }
    }

    function mainLoop() {
        if (state !== PAUSE) {
            ++tick;
        }

        mapMaze.drawPills(canvasContext);

        if (state === PLAYING) {
            mainDraw();
        }  else if (state === EATEN_PAUSE && (tick - timerStart) > (FPS / 3)) {
            mapMaze.draw(canvasContext);
            setState(PLAYING);
        } else if (state === DYING) {
            if (tick - timerStart > (FPS * 2)) {
                loseLife();
            } else {
                redrawBlock(userPos);
                for (let i = 0, len = ghosts.length; i < len; i += 1) {
                    redrawBlock(ghostPos[i].old);
                    ghostPos.push(ghosts[i].draw(canvasContext));
                }
                users.drawDead(canvasContext, (tick - timerStart) / (FPS * 2));
            }
        } else if (state === COUNTDOWN) {

            let diff = 4 + Math.floor((timerStart - tick) / FPS);

            if (diff === 0) {
                mapMaze.draw(canvasContext);
                setState(PLAYING);
            } else {
                if (diff !== lastTime) {
                    lastTime = diff;
                    mapMaze.draw(canvasContext);
                    dialog("Starting in: " + diff);
                }
            }
        }
    }

    function eatenPill() {
        audio.play("eatpill");
        timerStart = tick;
        eatenCount = 0;
        for (let i = 0; i < ghosts.length; i += 1) {
            ghosts[i].makeEatable();
        }
    }


    function keyPress(e) {
        if (state !== WAITING && state !== PAUSE) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function keyDown(e) {
        if (e.keyCode === KEY.N) {
            startNewGame();
        } else if (e.keyCode === KEY.S) {
            audio.disableSound();
            localStorage["soundDisabled"] = !soundDisabled();
        } else if (e.keyCode === KEY.P && state === PAUSE) {
            audio.resume();
            mapMaze.draw(canvasContext);
            setState(stored);
        } else if (e.keyCode === KEY.P) {
            stored = state;
            setState(PAUSE);
            audio.pause();
            mapMaze.draw(canvasContext);
            dialog("Paused");
        } else if (state !== PAUSE) {

        }
        return true;
    }

    function registerPlayers(inputPlayers: Player[]) {
        players = inputPlayers;
    }

    function init(rootElement, soundDir: string) {
        const blockSize: number = rootElement.offsetWidth / 19;
        let canvas = document.createElement("canvas");

        canvas.setAttribute("width", (blockSize * 19) + "px");
        canvas.setAttribute("height", (blockSize * 22) + "px");

        rootElement.appendChild(canvas);

        canvasContext = canvas.getContext('2d');

        audio = new PacmanAudio(soundDisabled());
        mapMaze = new PacmanMap(blockSize);
        setUpUsers(players);

        for (let i = 0, numberOfGhost = ghostSpecs.length; i < numberOfGhost; i += 1) {
            const ghost = new PacmanGhost({"getTick": getTick}, mapMaze, ghostSpecs[i]);
            ghosts.push(ghost);
        }

        const extension = "mp3";
        // var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';

        const audioFiles: AudioFile[] = [
            {event: "start", path: soundDir + "audio/opening_song." + extension},
            {event: "die", path: soundDir + "audio/die." + extension},
            {event: "eatghost", path: soundDir + "audio/eatghost." + extension},
            {event: "eatpill", path: soundDir + "audio/eatpill." + extension},
            {event: "eating", path: soundDir + "audio/eating.short." + extension},
            {event: "eating2", path: soundDir + "audio/eating.short." + extension}
        ];

        loadAudio(audioFiles, () => loading());
    }

    function setUpUsers(players: Player[]) {
        let pacmanUsers = players.map(player => new PacmanUser({
                "eatenPill": eatenPill,
                player: player
            }, mapMaze));

        users = new PacmanUsers(pacmanUsers);
    }

    function loadAudio(audioFiles: AudioFile[], whenFinish) {
        if (audioFiles.length === 0) {
            whenFinish();
        } else {
            // @ts-ignore
            const audioFile: AudioFile = audioFiles.pop();
            audio.load(audioFile.event, audioFile.path, () => loadAudio(audioFiles, whenFinish));
        }
    }

    function loading() {
        mapMaze.draw(canvasContext);
        dialog("Loading...");

        document.addEventListener("keydown", keyDown, true);
        document.addEventListener("keypress", keyPress, true);

        timer = window.setInterval(mainLoop, 1000 / FPS);
    }

    return {
        "init": init,
        "move": move,
        "startNewGame": startNewGame,
        "registerPlayers": registerPlayers,
        "setGhost": setGhost,
    };

}());

export default PACMAN
