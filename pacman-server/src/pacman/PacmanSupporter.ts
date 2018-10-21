import {BISCUIT, BLOCK, DOWN, EMPTY, FPS, LEFT, PILL, RIGHT, UP, WAITING, WALL} from "@/pacman/pacmanConst";
import PacmanMaze from "@/pacman/PacmanMaze";

let PacmanSupporter: any = {};
PacmanSupporter.Ghost = function (game, map, colour) {

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
    }
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
    }
    function isVunerable() {
        return eatable !== null;
    }
    function isDangerous() {
        return eaten === null;
    }
    function isHidden() {
        return eatable === null && eaten !== null;
    }
    function getRandomDirection() {
        var moves = (direction === LEFT || direction === RIGHT) ?
            [UP, DOWN] : [LEFT, RIGHT];
        return moves[Math.floor(Math.random() * 2)];
    }
    function reset() {
        eaten = null;
        eatable = null;
        position = {
            "x": 90,
            "y": 80
        };
        direction = getRandomDirection();
        due = getRandomDirection();
    }
    function onWholeSquare(x) {
        return x % 10 === 0;
    }
    function oppositeDirection(dir) {
        return dir === LEFT && RIGHT ||
            dir === RIGHT && LEFT ||
            dir === UP && DOWN || UP;
    }
    function makeEatable() {
        direction = oppositeDirection(direction);
        eatable = game.getTick();
    }
    function eat() {
        eatable = null;
        eaten = game.getTick();
    }
    function pointToCoord(x) {
        return Math.round(x / 10);
    }
    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    }
    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    }
    function secondsAgo(tick) {
        return (game.getTick() - tick) / FPS;
    }
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
    }
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

    }
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
    }
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
    }
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


PacmanSupporter.Map = function (size) {

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

        for (let i = 0; i < PacmanMaze.WALLS.length; i += 1) {
            line = PacmanMaze.WALLS[i];
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
    }
    function reset() {
        map = clone(PacmanMaze.MAP);
        height = map.length;
        width = map[0].length;
    }
    function block(pos) {
        return map[pos.y][pos.x];
    }
    function setBlock(pos, type) {
        map[pos.y][pos.x] = type;
    }
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
    }
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
    }
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
    }
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

PacmanSupporter.Audio = function (game) {

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
    }
    function progress(event, name, callback) {
        if (event.loaded === event.total && typeof callback === "function") {
            callback();
            files[name].removeEventListener("canplaythrough",
                progressEvents[name], true);
        }
    }
    function disableSound() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
            files[playing[i]].currentTime = 0;
        }
        playing = [];
    }
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
    }
    function play(name) {
        if (!game.soundDisabled()) {
            endEvents[name] = function () {
                ended(name);
            };
            playing.push(name);
            files[name].addEventListener("ended", endEvents[name], true);
            files[name].play();
        }
    }
    function pause() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
        }
    }
    function resume() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].play();
        }
    }
    return {
        "disableSound": disableSound,
        "load": load,
        "play": play,
        "pause": pause,
        "resume": resume
    };
};

export default PacmanSupporter;