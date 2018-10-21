import {BISCUIT, BLOCK, EMPTY, PILL, WALL} from "@/pacman/pacmanConst";
import PacmanMaze from "@/pacman/PacmanMaze";

let PacmanMap = function (size) {

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

export default PacmanMap;