import * as CONST from "./pacmanConst"
// import Modernizr from 'modernizr'

import PacmanUser from "./pacmanUser";
import Player from "../player";

var Pacman:any={};
var {LEFT,WAITING,RIGHT,DOWN,UP,PAUSE,PLAYING,COUNTDOWN,EATEN_PAUSE,DYING,FPS,BISCUIT,EMPTY,BLOCK,PILL,WALL} = CONST;
Pacman.Ghost = function (game, map, colour) {

    var position: any = null,
        direction: any = null,
        eatable: any = null,
        eaten: any = null,
        due: any = null;



    function getNewCoord(dir, current) {

        var speed = isVunerable() ? 1 : isHidden() ? 4 : 2,
            xSpeed = (dir === WAITING && -speed || dir === RIGHT && speed || 0),
            ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);

        return {
            "x": addBounded(current.x, xSpeed),
            "y": addBounded(current.y, ySpeed)
        };
    };

    /* Collision detection(walls) is done when a ghost lands on an
     * exact block, make sure they dont skip over it
     */
    function addBounded(x1, x2) {
        var rem = x1 % 10,
            result = rem + x2;
        if (rem !== 0 && result > 10) {
            return x1 + (10 - rem);
        } else if (rem > 0 && result < 0) {
            return x1 - rem;
        }
        return x1 + x2;
    };

    function isVunerable() {
        return eatable !== null;
    };

    function isDangerous() {
        return eaten === null;
    };

    function isHidden() {
        return eatable === null && eaten !== null;
    };

    function getRandomDirection() {
        var moves = (direction === LEFT || direction === RIGHT) ?
            [UP, DOWN] : [LEFT, RIGHT];
        return moves[Math.floor(Math.random() * 2)];
    };

    function reset() {
        eaten = null;
        eatable = null;
        position = {
            "x": 90,
            "y": 80
        };
        direction = getRandomDirection();
        due = getRandomDirection();
    };

    function onWholeSquare(x) {
        return x % 10 === 0;
    };

    function oppositeDirection(dir) {
        return dir === LEFT && RIGHT ||
            dir === RIGHT && LEFT ||
            dir === UP && DOWN || UP;
    };

    function makeEatable() {
        direction = oppositeDirection(direction);
        eatable = game.getTick();
    };

    function eat() {
        eatable = null;
        eaten = game.getTick();
    };

    function pointToCoord(x) {
        return Math.round(x / 10);
    };

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function secondsAgo(tick) {
        return (game.getTick() - tick) / FPS;
    };

    function getColour() {
        if (eatable) {
            if (secondsAgo(eatable) > 5) {
                return game.getTick() % 20 > 10 ? "#FFFFFF" : "#0000BB";
            } else {
                return "#0000BB";
            }
        } else if (eaten) {
            return "#222";
        }
        return colour;
    };

    function draw(ctx) {

        var s = map.blockSize,
            top = (position.y / 10) * s,
            left = (position.x / 10) * s;

        if (eatable && secondsAgo(eatable) > 8) {
            eatable = null;
        }

        if (eaten && secondsAgo(eaten) > 3) {
            eaten = null;
        }

        var tl = left + s;
        var base = top + s - 3;
        var inc = s / 10;

        var high = game.getTick() % 10 > 5 ? 3 : -3;
        var low = game.getTick() % 10 > 5 ? -3 : 3;

        ctx.fillStyle = getColour();
        ctx.beginPath();

        ctx.moveTo(left, base);

        ctx.quadraticCurveTo(left, top, left + (s / 2), top);
        ctx.quadraticCurveTo(left + s, top, left + s, base);

        // Wavy things at the bottom
        ctx.quadraticCurveTo(tl - (inc * 1), base + high, tl - (inc * 2), base);
        ctx.quadraticCurveTo(tl - (inc * 3), base + low, tl - (inc * 4), base);
        ctx.quadraticCurveTo(tl - (inc * 5), base + high, tl - (inc * 6), base);
        ctx.quadraticCurveTo(tl - (inc * 7), base + low, tl - (inc * 8), base);
        ctx.quadraticCurveTo(tl - (inc * 9), base + high, tl - (inc * 10), base);

        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.arc(left + 6, top + 6, s / 6, 0, 300, false);
        ctx.arc((left + s) - 6, top + 6, s / 6, 0, 300, false);
        ctx.closePath();
        ctx.fill();

        var f = s / 12;
        var off = {};
        off[RIGHT] = [f, 0];
        off[LEFT] = [-f, 0];
        off[UP] = [0, -f];
        off[DOWN] = [0, f];

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(left + 6 + off[direction][0], top + 6 + off[direction][1],
            s / 15, 0, 300, false);
        ctx.arc((left + s) - 6 + off[direction][0], top + 6 + off[direction][1],
            s / 15, 0, 300, false);
        ctx.closePath();
        ctx.fill();

    };

    function pane(pos) {

        if (pos.y === 100 && pos.x >= 190 && direction === RIGHT) {
            return {
                "y": 100,
                "x": -10
            };
        }

        if (pos.y === 100 && pos.x <= -10 && direction === LEFT) {
            return position = {
                "y": 100,
                "x": 190
            };
        }

        return false;
    };

    function move(ctx) {

        var oldPos = position,
            onGrid = onGridSquare(position),
            npos: any = null;

        if (due !== direction) {

            npos = getNewCoord(due, position);

            if (onGrid &&
                map.isFloorSpace({
                    "y": pointToCoord(nextSquare(npos.y, due)),
                    "x": pointToCoord(nextSquare(npos.x, due))
                })) {
                direction = due;
            } else {
                npos = null;
            }
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }

        if (onGrid &&
            map.isWallSpace({
                "y": pointToCoord(nextSquare(npos.y, direction)),
                "x": pointToCoord(nextSquare(npos.x, direction))
            })) {

            due = getRandomDirection();
            return move(ctx);
        }

        position = npos;

        var tmp = pane(position);
        if (tmp) {
            position = tmp;
        }

        due = getRandomDirection();

        return {
            "new": position,
            "old": oldPos
        };
    };

    return {
        "eat": eat,
        "isVunerable": isVunerable,
        "isDangerous": isDangerous,
        "makeEatable": makeEatable,
        "reset": reset,
        "move": move,
        "draw": draw
    };
};


Pacman.Map = function (size) {

    var height: any = null,
        width: any = null,
        blockSize = size,
        pillSize = 0,
        map: any = null;

    function withinBounds(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width;
    }

    function isWall(pos) {
        return withinBounds(pos.y, pos.x) && map[pos.y][pos.x] === WALL;
    }

    function isFloorSpace(pos) {
        if (!withinBounds(pos.y, pos.x)) {
            return false;
        }
        var peice = map[pos.y][pos.x];
        return peice === EMPTY ||
            peice === BISCUIT ||
            peice === PILL;
    }

    function drawWall(ctx) {

        var i, j, p, line;

        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        for (let i = 0; i < Pacman.WALLS.length; i += 1) {
            line = Pacman.WALLS[i];
            ctx.beginPath();

            for (j = 0; j < line.length; j += 1) {

                p = line[j];

                if (p.move) {
                    ctx.moveTo(p.move[0] * blockSize, p.move[1] * blockSize);
                } else if (p.line) {
                    ctx.lineTo(p.line[0] * blockSize, p.line[1] * blockSize);
                } else if (p.curve) {
                    ctx.quadraticCurveTo(p.curve[0] * blockSize,
                        p.curve[1] * blockSize,
                        p.curve[2] * blockSize,
                        p.curve[3] * blockSize);
                }
            }
            ctx.stroke();
        }
    }

    function clone(object) {
        var i, newObj = (object instanceof Array) ? [] : {};
        for (let i in object) {
            if (i === 'clone') {
                continue;
            }
            if (object[i] && typeof object[i] === "object") {
                newObj[i] = clone(object[i]);
            } else {
                newObj[i] = object[i];
            }
        }
        return newObj;
    };

    function reset() {
        map = clone(Pacman.MAP);
        height = map.length;
        width = map[0].length;
    };

    function block(pos) {
        return map[pos.y][pos.x];
    };

    function setBlock(pos, type) {
        map[pos.y][pos.x] = type;
    };

    function drawPills(ctx) {

        if (++pillSize > 30) {
            pillSize = 0;
        }

        for (let i = 0; i < height; i += 1) {
            for (let j = 0; j < width; j += 1) {
                if (map[i][j] === PILL) {
                    ctx.beginPath();

                    ctx.fillStyle = "#000";
                    ctx.fillRect((j * blockSize), (i * blockSize),
                        blockSize, blockSize);

                    ctx.fillStyle = "#FFF";
                    ctx.arc((j * blockSize) + blockSize / 2,
                        (i * blockSize) + blockSize / 2,
                        Math.abs(5 - (pillSize / 3)),
                        0,
                        Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };

    function draw(ctx) {

        var i, j, size = blockSize;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width * size, height * size);

        drawWall(ctx);

        for (let i = 0; i < height; i += 1) {
            for (j = 0; j < width; j += 1) {
                drawBlock(i, j, ctx);
            }
        }
    };

    function drawBlock(y, x, ctx) {

        var layout = map[y][x];

        if (layout === PILL) {
            return;
        }

        ctx.beginPath();

        if (layout === EMPTY || layout === BLOCK ||
            layout === BISCUIT) {

            ctx.fillStyle = "#000";
            ctx.fillRect((x * blockSize), (y * blockSize),
                blockSize, blockSize);

            if (layout === BISCUIT) {
                ctx.fillStyle = "#FFF";
                ctx.fillRect((x * blockSize) + (blockSize / 2.5),
                    (y * blockSize) + (blockSize / 2.5),
                    blockSize / 6, blockSize / 6);
            }
        }
        ctx.closePath();
    };

    reset();

    return {
        "draw": draw,
        "drawBlock": drawBlock,
        "drawPills": drawPills,
        "block": block,
        "setBlock": setBlock,
        "reset": reset,
        "isWallSpace": isWall,
        "isFloorSpace": isFloorSpace,
        "height": height,
        "width": width,
        "blockSize": blockSize
    };
};

Pacman.Audio = function (game) {

    var files: any = [],
        endEvents: any = [],
        progressEvents: any = [],
        playing: any[] = [];

    function load(name, path, cb) {

        var f = files[name] = document.createElement("audio");

        progressEvents[name] = function (event) {
            progress(event, name, cb);
        };

        f.addEventListener("canplaythrough", progressEvents[name], true);
        f.setAttribute("preload", "true");
        f.setAttribute("autobuffer", "true");
        f.setAttribute("src", path);
        f.pause();
    };

    function progress(event, name, callback) {
        if (event.loaded === event.total && typeof callback === "function") {
            callback();
            files[name].removeEventListener("canplaythrough",
                progressEvents[name], true);
        }
    };

    function disableSound() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
            files[playing[i]].currentTime = 0;
        }
        playing = [];
    };

    function ended(name) {

        var i, tmp: any = [],
            found = false;

        files[name].removeEventListener("ended", endEvents[name], true);

        for (let i = 0; i < playing.length; i++) {
            if (!found && playing[i]) {
                found = true;
            } else {
                tmp.push(playing[i]);
            }
        }
        playing = tmp;
    };

    function play(name) {
        if (!game.soundDisabled()) {
            endEvents[name] = function () {
                ended(name);
            };
            playing.push(name);
            files[name].addEventListener("ended", endEvents[name], true);
            files[name].play();
        }
    };

    function pause() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
        }
    };

    function resume() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].play();
        }
    };

    return {
        "disableSound": disableSound,
        "load": load,
        "play": play,
        "pause": pause,
        "resume": resume
    };
};

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
    };

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
    };

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
    };

    function collided(user, ghost) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) +
            Math.pow(ghost.y - user.y, 2))) < 10;
    };

    function drawFooter() {

        var topLeft = (map.height * map.blockSize),
            textBase = topLeft + 17;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);

        ctx.fillStyle = "#FFFF00";

        for (var i = 0, len = users.getLives(); i < len; i++) {
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(150 + (25 * i) + map.blockSize / 2,
                (topLeft + 1) + map.blockSize / 2);

            ctx.arc(150 + (25 * i) + map.blockSize / 2,
                (topLeft + 1) + map.blockSize / 2,
                map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
            ctx.fill();
        }

        ctx.fillStyle = !soundDisabled() ? "#00FF00" : "#FF0000";
        ctx.font = "bold 16px sans-serif";
        //ctx.fillText("♪", 10, textBase);
        ctx.fillText("s", 10, textBase);

        ctx.fillStyle = "#FFFF00";
        ctx.font = "14px Calibri";
        ctx.fillText("Score: " + users.theScore(), 30, textBase);
        ctx.fillText("Level: " + level, 260, textBase);
    }

    function redrawBlock(pos) {
        map.drawBlock(Math.floor(pos.y / 10), Math.floor(pos.x / 10), ctx);
        map.drawBlock(Math.ceil(pos.y / 10), Math.ceil(pos.x / 10), ctx);
    }

    function mainDraw() {

        var diff, userPos, i, len, nScore;

        ghostPos = [];
        userPos = []

        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            ghostPos.push(ghosts[i].move(ctx));
        }
        for (let i = 0, len = ghosts.length; i < len; i += 1) {
            redrawBlock(ghostPos[i].old);
        }
        userPos = users.move();
        userPos.forEach(pos => redrawBlock(pos.old))
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
    };

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
    };

    function completedLevel() {
        setState(WAITING);
        level += 1;
        map.reset();
        users.newLevel();
        startLevel();
    };

    function keyPress(e) {
        if (state !== WAITING && state !== PAUSE) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    function registerPlayers(inputPlayers:Player[]){
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

        audio = new Pacman.Audio({
            "soundDisabled": soundDisabled
        });
        map = new Pacman.Map(blockSize);
        setUpUsers(players);


        for (let i = 0, len = ghostSpecs.length; i < len; i += 1) {
            ghost = new Pacman.Ghost({
                "getTick": getTick
            }, map, ghostSpecs[i]);
            ghosts.push(ghost);
        }

        map.draw(ctx);
        dialog("Loading ...");

        var extension = "mp3"
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
    };
    function setUpUsers(players){
        let pacmanUsers = players.map(player=>{
            return new PacmanUser({
                "completedLevel": completedLevel,
                "eatenPill": eatenPill,
                player:player
            }, map);
        })

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
    };

    function loaded() {

        dialog("Press N to Start");

        // document.addEventListener("keydown", keyDown, true);
        // document.addEventListener("keypress", keyPress, true);

        timer = window.setInterval(mainLoop, 1000 / FPS);
    };

    return {
        "init": init,
        "move": keyDown,
        "startNewGame": startNewGame,
        "registerPlayers":registerPlayers
    };

}());

class PacmanUsers {
    addScore(nScore: any): any {
        throw new Error("Method not implemented.");
    }
    drawDead(ctx: any, arg1: number): any {
        throw new Error("Method not implemented.");
    }
    loseLife(): any {
        throw new Error("Method not implemented.");
    }
    constructor(private users:PacmanUser[]) {
    }

    newLevel() {
        this.users.forEach(element => element.newLevel());
    }
    keyDown(userIndex, direction) {
        this.users[userIndex].keyDown(direction)

    }
    reset() {
        this.users.forEach(element => element.reset());

    }
    getLives() {
        return 3;
    }
    theScore() {
        return 3;
    }
    resetPosition() {
        this.users.forEach(element => element.resetPosition());

    }
    move() {
        return this.users.map(element => element.move());

    }
    draw(ctx) {
        this.users.forEach(element => element.draw(ctx));

    }


}




Pacman.MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 4, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 4, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

Pacman.WALLS = [

    [{
            "move": [0, 9.5]
        }, {
            "line": [3, 9.5]
        },
        {
            "curve": [3.5, 9.5, 3.5, 9]
        }, {
            "line": [3.5, 8]
        },
        {
            "curve": [3.5, 7.5, 3, 7.5]
        }, {
            "line": [1, 7.5]
        },
        {
            "curve": [0.5, 7.5, 0.5, 7]
        }, {
            "line": [0.5, 1]
        },
        {
            "curve": [0.5, 0.5, 1, 0.5]
        }, {
            "line": [9, 0.5]
        },
        {
            "curve": [9.5, 0.5, 9.5, 1]
        }, {
            "line": [9.5, 3.5]
        }
    ],

    [{
            "move": [9.5, 1]
        },
        {
            "curve": [9.5, 0.5, 10, 0.5]
        }, {
            "line": [18, 0.5]
        },
        {
            "curve": [18.5, 0.5, 18.5, 1]
        }, {
            "line": [18.5, 7]
        },
        {
            "curve": [18.5, 7.5, 18, 7.5]
        }, {
            "line": [16, 7.5]
        },
        {
            "curve": [15.5, 7.5, 15.5, 8]
        }, {
            "line": [15.5, 9]
        },
        {
            "curve": [15.5, 9.5, 16, 9.5]
        }, {
            "line": [19, 9.5]
        }
    ],

    [{
        "move": [2.5, 5.5]
    }, {
        "line": [3.5, 5.5]
    }],

    [{
            "move": [3, 2.5]
        },
        {
            "curve": [3.5, 2.5, 3.5, 3]
        },
        {
            "curve": [3.5, 3.5, 3, 3.5]
        },
        {
            "curve": [2.5, 3.5, 2.5, 3]
        },
        {
            "curve": [2.5, 2.5, 3, 2.5]
        }
    ],

    [{
        "move": [15.5, 5.5]
    }, {
        "line": [16.5, 5.5]
    }],

    [{
            "move": [16, 2.5]
        }, {
            "curve": [16.5, 2.5, 16.5, 3]
        },
        {
            "curve": [16.5, 3.5, 16, 3.5]
        }, {
            "curve": [15.5, 3.5, 15.5, 3]
        },
        {
            "curve": [15.5, 2.5, 16, 2.5]
        }
    ],

    [{
            "move": [6, 2.5]
        }, {
            "line": [7, 2.5]
        }, {
            "curve": [7.5, 2.5, 7.5, 3]
        },
        {
            "curve": [7.5, 3.5, 7, 3.5]
        }, {
            "line": [6, 3.5]
        },
        {
            "curve": [5.5, 3.5, 5.5, 3]
        }, {
            "curve": [5.5, 2.5, 6, 2.5]
        }
    ],

    [{
            "move": [12, 2.5]
        }, {
            "line": [13, 2.5]
        }, {
            "curve": [13.5, 2.5, 13.5, 3]
        },
        {
            "curve": [13.5, 3.5, 13, 3.5]
        }, {
            "line": [12, 3.5]
        },
        {
            "curve": [11.5, 3.5, 11.5, 3]
        }, {
            "curve": [11.5, 2.5, 12, 2.5]
        }
    ],

    [{
            "move": [7.5, 5.5]
        }, {
            "line": [9, 5.5]
        }, {
            "curve": [9.5, 5.5, 9.5, 6]
        },
        {
            "line": [9.5, 7.5]
        }
    ],
    [{
            "move": [9.5, 6]
        }, {
            "curve": [9.5, 5.5, 10.5, 5.5]
        },
        {
            "line": [11.5, 5.5]
        }
    ],


    [{
            "move": [5.5, 5.5]
        }, {
            "line": [5.5, 7]
        }, {
            "curve": [5.5, 7.5, 6, 7.5]
        },
        {
            "line": [7.5, 7.5]
        }
    ],
    [{
        "move": [6, 7.5]
    }, {
        "curve": [5.5, 7.5, 5.5, 8]
    }, {
        "line": [5.5, 9.5]
    }],

    [{
            "move": [13.5, 5.5]
        }, {
            "line": [13.5, 7]
        },
        {
            "curve": [13.5, 7.5, 13, 7.5]
        }, {
            "line": [11.5, 7.5]
        }
    ],
    [{
            "move": [13, 7.5]
        }, {
            "curve": [13.5, 7.5, 13.5, 8]
        },
        {
            "line": [13.5, 9.5]
        }
    ],

    [{
            "move": [0, 11.5]
        }, {
            "line": [3, 11.5]
        }, {
            "curve": [3.5, 11.5, 3.5, 12]
        },
        {
            "line": [3.5, 13]
        }, {
            "curve": [3.5, 13.5, 3, 13.5]
        }, {
            "line": [1, 13.5]
        },
        {
            "curve": [0.5, 13.5, 0.5, 14]
        }, {
            "line": [0.5, 17]
        },
        {
            "curve": [0.5, 17.5, 1, 17.5]
        }, {
            "line": [1.5, 17.5]
        }
    ],
    [{
            "move": [1, 17.5]
        }, {
            "curve": [0.5, 17.5, 0.5, 18]
        }, {
            "line": [0.5, 21]
        },
        {
            "curve": [0.5, 21.5, 1, 21.5]
        }, {
            "line": [18, 21.5]
        },
        {
            "curve": [18.5, 21.5, 18.5, 21]
        }, {
            "line": [18.5, 18]
        },
        {
            "curve": [18.5, 17.5, 18, 17.5]
        }, {
            "line": [17.5, 17.5]
        }
    ],
    [{
            "move": [18, 17.5]
        }, {
            "curve": [18.5, 17.5, 18.5, 17]
        },
        {
            "line": [18.5, 14]
        }, {
            "curve": [18.5, 13.5, 18, 13.5]
        },
        {
            "line": [16, 13.5]
        }, {
            "curve": [15.5, 13.5, 15.5, 13]
        },
        {
            "line": [15.5, 12]
        }, {
            "curve": [15.5, 11.5, 16, 11.5]
        },
        {
            "line": [19, 11.5]
        }
    ],

    [{
        "move": [5.5, 11.5]
    }, {
        "line": [5.5, 13.5]
    }],
    [{
        "move": [13.5, 11.5]
    }, {
        "line": [13.5, 13.5]
    }],

    [{
            "move": [2.5, 15.5]
        }, {
            "line": [3, 15.5]
        },
        {
            "curve": [3.5, 15.5, 3.5, 16]
        }, {
            "line": [3.5, 17.5]
        }
    ],
    [{
            "move": [16.5, 15.5]
        }, {
            "line": [16, 15.5]
        },
        {
            "curve": [15.5, 15.5, 15.5, 16]
        }, {
            "line": [15.5, 17.5]
        }
    ],

    [{
        "move": [5.5, 15.5]
    }, {
        "line": [7.5, 15.5]
    }],
    [{
        "move": [11.5, 15.5]
    }, {
        "line": [13.5, 15.5]
    }],

    [{
            "move": [2.5, 19.5]
        }, {
            "line": [5, 19.5]
        },
        {
            "curve": [5.5, 19.5, 5.5, 19]
        }, {
            "line": [5.5, 17.5]
        }
    ],
    [{
            "move": [5.5, 19]
        }, {
            "curve": [5.5, 19.5, 6, 19.5]
        },
        {
            "line": [7.5, 19.5]
        }
    ],

    [{
            "move": [11.5, 19.5]
        }, {
            "line": [13, 19.5]
        },
        {
            "curve": [13.5, 19.5, 13.5, 19]
        }, {
            "line": [13.5, 17.5]
        }
    ],
    [{
            "move": [13.5, 19]
        }, {
            "curve": [13.5, 19.5, 14, 19.5]
        },
        {
            "line": [16.5, 19.5]
        }
    ],

    [{
            "move": [7.5, 13.5]
        }, {
            "line": [9, 13.5]
        },
        {
            "curve": [9.5, 13.5, 9.5, 14]
        }, {
            "line": [9.5, 15.5]
        }
    ],
    [{
            "move": [9.5, 14]
        }, {
            "curve": [9.5, 13.5, 10, 13.5]
        },
        {
            "line": [11.5, 13.5]
        }
    ],

    [{
            "move": [7.5, 17.5]
        }, {
            "line": [9, 17.5]
        },
        {
            "curve": [9.5, 17.5, 9.5, 18]
        }, {
            "line": [9.5, 19.5]
        }
    ],
    [{
            "move": [9.5, 18]
        }, {
            "curve": [9.5, 17.5, 10, 17.5]
        },
        {
            "line": [11.5, 17.5]
        }
    ],

    [{
            "move": [8.5, 9.5]
        }, {
            "line": [8, 9.5]
        }, {
            "curve": [7.5, 9.5, 7.5, 10]
        },
        {
            "line": [7.5, 11]
        }, {
            "curve": [7.5, 11.5, 8, 11.5]
        },
        {
            "line": [11, 11.5]
        }, {
            "curve": [11.5, 11.5, 11.5, 11]
        },
        {
            "line": [11.5, 10]
        }, {
            "curve": [11.5, 9.5, 11, 9.5]
        },
        {
            "line": [10.5, 9.5]
        }
    ]
];
export default PACMAN
