// import Modernizr from 'modernizr'

import PacmanUser from "@/pacman/pacmanUser";
import Player from "@/player";
import PacmanUsers from "@/pacman/PacmanUsers";
import {COUNTDOWN, DYING, EATEN_PAUSE, FPS, KEY, PAUSE, PLAYING, WAITING} from "@/pacman/pacmanConst";
import PacmanAudio from "@/pacman/PacmanAudio";
import GHOST from "@/pacman/PacmanGhost";
import PacmanMap from "@/pacman/PacmanMap";
import {AudioFile, PacmanPosition, Point} from "@/types";
import {YELLOW} from "@/defined-color";

var PACMAN = function () {

    let state: number = WAITING;
    let audio: PacmanAudio;
    let ghosts:  any[]=[];
    let ghostSpecs: string[] = [];
    let eatenCount: number = 0;
    let level: number = 0;
    let tick: number = 0;
    let ghostPos: PacmanPosition[];
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
        // Stop Game when lose life
        users.loseLife();
        stop();
        dialog("Game over -_-");
        // if (users.getLives() > 0) {
        //     startLevel();
        // }
    }

    function setState(nState) {
        state = nState;
        stateChanged = true;
    }

    function collided(user, ghost: Point) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) + Math.pow(ghost.y - user.y, 2))) < 10;
    }

    function redrawBlock(pos: Point) {
        mapMaze.drawBlock(Math.floor(pos.y / 10), Math.floor(pos.x / 10), canvasContext);
        mapMaze.drawBlock(Math.ceil(pos.y / 10), Math.ceil(pos.x / 10), canvasContext);
    }

    function mainDraw() {
        let nScore;
        ghostPos = [];

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghostPos.push(ghosts[i].move(canvasContext));
        }
        let userPos: PacmanPosition[] = users.move();
        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            redrawBlock(ghostPos[i].old);
        }
        userPos.forEach(pos => redrawBlock(pos.old));

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghosts[i].draw(canvasContext);
        }
        users.draw(canvasContext);

        let user1 = userPos[0].new;
        let user2;
        if (userPos[1]) {
            user2 = userPos[1].new;
        }

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            if (collided(user1, ghostPos[i].new)) {
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
            if (user2 && collided(user2, ghostPos[i].new)) {
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
                    ghosts[i].draw(canvasContext);
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
    
    function eatenBiscuit() {
        audio.play("eating2");
    }


    function keyPress(e) {
        if (state !== WAITING && state !== PAUSE) {
            e.preventDefault();
            e.stopPropagation();
        }
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

        //ghosts=[];
        for (let i = 0, numberOfGhost = ghostSpecs.length; i < numberOfGhost; i += 1) {
            const ghost =  GHOST({"getTick": getTick}, mapMaze, ghostSpecs[i]);
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
                "eatenBiscuit": eatenBiscuit,
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

        document.addEventListener("keypress", keyPress, true);

        timer = window.setInterval(mainLoop, 1000 / FPS);
    }

    function stop(){
        clearInterval(timer);
    }

    function timeout() {
        dialog("Time's up!!!!");
        clearInterval(timer);
    }

    return {
        "init": init,
        "move": move,
        "startNewGame": startNewGame,
        "registerPlayers": registerPlayers,
        "setGhost": setGhost,
        "timeout": timeout,
        "stop": stop,
    };

};

export default PACMAN
