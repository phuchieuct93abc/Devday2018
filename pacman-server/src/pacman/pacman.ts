// import Modernizr from 'modernizr'

import PacmanUser from "@/pacman/pacmanUser";
import Player from "@/player";
import PacmanUsers from "@/pacman/PacmanUsers";
import {COUNTDOWN, DYING, EATEN_PAUSE, FPS, PAUSE, PLAYING, WAITING} from "@/pacman/pacmanConst";
import PacmanAudio from "@/pacman/PacmanAudio";
import PacmanGhost from "@/pacman/PacmanGhost";
import PacmanMap from "@/pacman/PacmanMap";

var PACMAN = (function () {

    var state: any = WAITING,
        audio: any = null,
        ghosts: any = [],
        ghostSpecs: any = [],
        eatenCount: number = 0,
        level: number = 0,
        tick: number = 0,
        ghostPos: any, userPos: any,
        stateChanged: any = true,
        timerStart: any = null,
        lastTime: number = 0,
        ctx: any = null,
        timer: any = null,
        map: any = null,
        users: PacmanUsers,
        stored: any = null,
        players: Player[] = [];

    function setGhost() {
        ghostSpecs = ["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"]

    }

    function getTick() {
        return tick;
    }

    function drawScore(text, position) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px BDCartoonShoutRegular";
        ctx.fillText(text,
            (position["new"]["x"] / 10) * map.blockSize,
            ((position["new"]["y"] + 5) / 10) * map.blockSize);
    }

    function dialog(text) {
        ctx.fillStyle = "#FFFF00";
        ctx.font = "18px Calibri";
        var width = ctx.measureText(text).width,
            x = ((map.width * map.blockSize) - width) / 2;
        ctx.fillText(text, x, (map.height * 10) + 8);
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
        map.reset();
        map.draw(ctx);
        startLevel();
    }

    function keyDown(userIndex, direction) {

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

    function collided(user, ghost) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) +
            Math.pow(ghost.y - user.y, 2))) < 10;
    }

    function redrawBlock(pos) {
        map.drawBlock(Math.floor(pos.y / 10), Math.floor(pos.x / 10), ctx);
        map.drawBlock(Math.ceil(pos.y / 10), Math.ceil(pos.x / 10), ctx);
    }

    function mainDraw() {

        var diff, userPos, i, len, nScore;

        ghostPos = [];
        userPos = [];

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghostPos.push(ghosts[i].move(ctx));
        }
        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            redrawBlock(ghostPos[i].old);
        }
        userPos = users.move();
        userPos.forEach(pos => redrawBlock(pos.old));
        //TODO
        //redrawBlock(userPos.old);

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghosts[i].draw(ctx);
        }
        users.draw(ctx);

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

        var diff;

        if (state !== PAUSE) {
            ++tick;
        }

        map.drawPills(ctx);

        if (state === PLAYING) {
            mainDraw();
        } else if (state === WAITING && stateChanged) {
            stateChanged = false;
            map.draw(ctx);
            dialog("Press N to start a New game");
        } else if (state === EATEN_PAUSE &&
            (tick - timerStart) > (FPS / 3)) {
            map.draw(ctx);
            setState(PLAYING);
        } else if (state === DYING) {
            if (tick - timerStart > (FPS * 2)) {
                loseLife();
            } else {
                redrawBlock(userPos);
                for (let i = 0, len = ghosts.length; i < len; i += 1) {
                    redrawBlock(ghostPos[i].old);
                    ghostPos.push(ghosts[i].draw(ctx));
                }
                users.drawDead(ctx, (tick - timerStart) / (FPS * 2));
            }
        } else if (state === COUNTDOWN) {

            diff = 5 + Math.floor((timerStart - tick) / FPS);

            if (diff === 0) {
                map.draw(ctx);
                setState(PLAYING);
            } else {
                if (diff !== lastTime) {
                    lastTime = diff;
                    map.draw(ctx);
                    dialog("Starting in: " + diff);
                }
            }
        }
        //TODO: Remove footer
        // drawFooter();
    }

    function eatenPill() {
        audio.play("eatpill");
        timerStart = tick;
        eatenCount = 0;
        for (let i = 0; i < ghosts.length; i += 1) {
            ghosts[i].makeEatable(ctx);
        }
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

    function init(wrapper, root) {

        var i, len, ghost,
            blockSize = wrapper.offsetWidth / 19,
            canvas = document.createElement("canvas");

        canvas.setAttribute("width", (blockSize * 19) + "px");
        canvas.setAttribute("height", (blockSize * 22) + 30 + "px");

        wrapper.appendChild(canvas);

        ctx = canvas.getContext('2d');

        audio = new PacmanAudio({
            "soundDisabled": soundDisabled
        });
        map = PacmanMap(blockSize);
        setUpUsers(players);


        for (let i = 0, len = ghostSpecs.length; i < len; i += 1) {
            ghost = PacmanGhost({
                "getTick": getTick
            }, map, ghostSpecs[i]);
            ghosts.push(ghost);
        }

        map.draw(ctx);
        dialog("Loading ...");

        var extension = "mp3";
        // var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';

        var audio_files = [
            ["start", root + "audio/opening_song." + extension],
            ["die", root + "audio/die." + extension],
            ["eatghost", root + "audio/eatghost." + extension],
            ["eatpill", root + "audio/eatpill." + extension],
            ["eating", root + "audio/eating.short." + extension],
            ["eating2", root + "audio/eating.short." + extension]
        ];

        load(audio_files, function () {
            loaded();
        });
    }

    function setUpUsers(players) {
        let pacmanUsers = players.map(player => {
            return new PacmanUser({
                "eatenPill": eatenPill,
                player: player
            }, map);
        });

        users = new PacmanUsers(pacmanUsers);

    }

    function load(arr, callback) {

        if (arr.length === 0) {
            callback();
        } else {
            var x = arr.pop();
            audio.load(x[0], x[1], function () {
                load(arr, callback);
            });
        }
    }

    function loaded() {

        dialog("Press N to Start");

        // document.addEventListener("keydown", keyDown, true);
        // document.addEventListener("keypress", keyPress, true);

        timer = window.setInterval(mainLoop, 1000 / FPS);
    }

    return {
        "init": init,
        "move": keyDown,
        "startNewGame": startNewGame,
        "registerPlayers": registerPlayers
    };

}());

export default PACMAN
